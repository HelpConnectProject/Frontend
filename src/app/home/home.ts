import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  @ViewChild('aboutSection') aboutSection!: ElementRef;

  scrollToAbout() {
    if (this.aboutSection) {
      this.aboutSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
