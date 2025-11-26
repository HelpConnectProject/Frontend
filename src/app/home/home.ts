import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
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
