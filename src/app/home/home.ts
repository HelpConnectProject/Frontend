import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  isAboutVisible = false;

  toggleAbout() {
    this.isAboutVisible = !this.isAboutVisible;

    if (this.isAboutVisible) {
      setTimeout(() => {
        const section = document.getElementById('about');
        section?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  }
}
