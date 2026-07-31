import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserRole } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { SiteService } from '../site-services/entities/site-service.entity';
import { Project } from '../projects/entities/project.entity';
import { Testimonial } from '../testimonials/entities/testimonial.entity';
import { Message } from '../messages/entities/message.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(SiteService)
    private serviceRepository: Repository<SiteService>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(Testimonial)
    private testimonialRepository: Repository<Testimonial>,

    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async getStats() {
    const [
      users,
      products,
      services,
      projects,
      testimonials,
      messages,
      unreadMessages,
    ] = await Promise.all([
      this.userRepository.count(),
      this.productRepository.count(),
      this.serviceRepository.count(),
      this.projectRepository.count(),
      this.testimonialRepository.count(),
      this.messageRepository.count(),
      this.messageRepository.count({
        where: {
          isRead: false,
        },
      }),
    ]);

    return {
      users,
      products,
      services,
      projects,
      testimonials,
      messages,
      unreadMessages,
    };
  }

  async getDashboard() {
    const stats = await this.getStats();
    const activities = await this.getRecentActivities();
    return {
      stats,
      activities,
    };
  }

  async getRecentActivities() {
    const [messages, projects, products, users] = await Promise.all([
      this.messageRepository.find({
        order: {
          created_at: 'DESC',
        },
        take: 5,
      }),

      this.projectRepository.find({
        order: {
          created_at: 'DESC',
        },
        take: 5,
      }),

      this.productRepository.find({
        order: {
          created_at: 'DESC',
        },
        take: 5,
      }),

      this.userRepository.find({
        where: {
          role: UserRole.ADMIN,
        },
        order: {
          updated_at: 'DESC',
        },
        take: 5,
      }),
    ]);

    return {
      recentMessages: messages,
      recentProjects: projects,
      recentProducts: products,
      recentAdminConnections: users,
    };
  }
}
