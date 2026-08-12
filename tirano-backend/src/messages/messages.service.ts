import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SearchDto } from 'src/common/dto/search.dto';
import { SortDto } from 'src/common/dto/sort.dto';

import { BaseService } from 'src/common/services/base.service';

import { ResponseUtil } from 'src/common/utils/response.util';

import { NotificationsService } from 'src/notifications/notifications.service';

import { Message } from './entities/message.entity';

import { MessageResponseDto } from './dto/mesage-response.dto';

import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService extends BaseService<Message> {
  constructor(
    @InjectRepository(Message)
    repository: Repository<Message>,

    notifications: NotificationsService,
  ) {
    super(repository, 'Message', notifications);
  }

  // =========================================================
  // CREATE MESSAGE
  // =========================================================

  async createMessage(dto: CreateMessageDto) {
    const message = this.repository.create({
      fullname: dto.fullname,

      email: dto.email,

      phone: dto.phone,

      subject: dto.subject,

      message: dto.message,

      isRead: false,
    });

    const saved = await this.repository.save(message);

    return new MessageResponseDto(saved);
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  async findAll(pagination: PaginationDto, search: SearchDto, sort: SortDto) {
    const page = pagination.page ?? 1;

    const limit = pagination.limit ?? 10;

    const query = this.repository.createQueryBuilder('message');

    // -------------------------------------------------------
    // SEARCH
    // -------------------------------------------------------

    if (search.search) {
      query.where(
        `
          message.fullname LIKE :search
          OR message.email LIKE :search
          OR message.phone LIKE :search
          OR message.subject LIKE :search
          OR message.message LIKE :search
        `,
        {
          search: `%${search.search}%`,
        },
      );
    }

    // -------------------------------------------------------
    // SORT
    // -------------------------------------------------------

    const allowedSortFields = [
      'created_at',
      'updated_at',
      'fullname',
      'email',
      'phone',
      'subject',
      'isRead',
    ];

    const sortBy = allowedSortFields.includes(sort.sortBy ?? '')
      ? sort.sortBy
      : 'created_at';

    const sortOrder = sort.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    query.orderBy(`message.${sortBy}`, sortOrder);

    // -------------------------------------------------------
    // PAGINATION
    // -------------------------------------------------------

    query.skip((page - 1) * limit);

    query.take(limit);

    // -------------------------------------------------------
    // EXECUTE
    // -------------------------------------------------------

    const [messages, total] = await query.getManyAndCount();

    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------

    return ResponseUtil.paginate(
      messages.map((message) => new MessageResponseDto(message)),

      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },

      'Liste messages',
    );
  }

  // =========================================================
  // MARK AS READ
  // =========================================================

  async markAsRead(id: number) {
    const message = await this.findOne(id);

    message.isRead = true;

    return this.repository.save(message);
  }

  // =========================================================
  // MARK AS UNREAD
  // =========================================================

  async markAsUnread(id: number) {
    const message = await this.findOne(id);

    message.isRead = false;

    return this.repository.save(message);
  }
}
