import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnDestroy {
  isMenuOpen = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  toggleMenu() {
    this.setMenuOpen(!this.isMenuOpen);
  }

  closeMenu() {
    this.setMenuOpen(false);
  }

  private setMenuOpen(open: boolean) {
    this.isMenuOpen = open;
    this.document.body.style.overflow = open ? 'hidden' : '';
  }

  @HostListener('window:keydown.escape')
  onEscape() {
    this.closeMenu();
  }

  @HostListener('window:resize')
  onResize() {
    if (typeof window !== 'undefined' && window.innerWidth > 900 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = '';
  }
}
