import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { SearchDto } from "src/common/dto/search.dto";
import { SortDto } from "src/common/dto/sort.dto";
import { BaseService } from "src/common/services/base.service";
import { ResponseUtil } from "src/common/utils/response.util";
import { MediaService } from "src/media/media.service";
import { Repository } from "typeorm";
import { MessageResponseDto } from "./dto/mesage-response.dto";
import { Message } from "./entities/message.entity";

@Injectable()
export class MessagesService extends BaseService<Message> {
  constructor(
    @InjectRepository(Message)
    repository: Repository<Message>,
    private readonly mediaService: MediaService,
  ) {
    super(repository, 'Message');
  }

  async findAll(pagination: PaginationDto, search: SearchDto, sort: SortDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    const query = this.repository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.medias', 'media');

    if (search.search) {
      query.where(
        `
        message.fullname LIKE :search
        OR message.email LIKE :search
        OR message.subject LIKE :search
        OR message.message LIKE :search
        `,
        {
          search: `%${search.search}%`,
        },
      );
    }

    query.orderBy(
      `message.${sort.sortBy ?? 'created_at'}`,
      sort.sortOrder ?? 'DESC',
    );

    query.skip((page - 1) * limit);
    query.take(limit);

    const [messages, total] = await query.getManyAndCount();

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

  async markAsRead(id: number) {
    const message = await this.findOne(id);

    message.isRead = true;

    return this.repository.save(message);
  }

  async markAsUnread(id: number) {
    const message = await this.findOne(id);

    message.isRead = false;

    return this.repository.save(message);
  }
}
