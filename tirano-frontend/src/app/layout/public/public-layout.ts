import { Component } from '@angular/core';
import { Footer } from './footer/footer';
import { Navbar } from './navbar/navbar';
import { HomePage } from "../../features/home/home-page";
import { ContactPage } from "../../features/contact/contact-page";
import { ServiceListPage } from "../../features/services/service-list-page/service-list-page";
import { ProjectListPage } from "../../features/projects/project-list-page/project-list-page";
import { ProductListPage } from "../../features/products/product-list-page/product-list-page";
import { ArticleListPage } from "../../features/articles/article-list-page/article-list-page";

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    Navbar,
    Footer,
    HomePage,
    ContactPage,
    ServiceListPage,
    ProjectListPage,
    ProductListPage,
    ArticleListPage
],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {}