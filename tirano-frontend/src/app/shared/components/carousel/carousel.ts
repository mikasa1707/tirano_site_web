import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carousel',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './carousel.html',
})
export class Carousel {
  @Input({ required: true })
  items: CarouselItem[] = [];
}

export interface CarouselItem {
  image: string;

  title?: string;

  subtitle?: string;

  buttonText?: string;

  buttonLink?: string;
}
