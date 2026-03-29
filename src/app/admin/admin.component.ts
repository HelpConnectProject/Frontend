import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AdminService } from '../admin.service';
import { BehaviorSubject, catchError, finalize, map, of, shareReplay, startWith, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

type AdminUser = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string | null;
  status: string | null;
  phone: string | null;
  city: string | null;
  about: string | null;
  profile_image: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type UsersResponse = {
  data: AdminUser[];
};

type AdminState = {
  loading: boolean;
  users: AdminUser[];
  error: string;
};

@Component({
  selector: 'app-admin',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  private readonly adminService = inject(AdminService);

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);
  private readonly busyUserIds = new Set<number>();

  readonly isSuperAdmin = localStorage.getItem('role') === 'superadmin';

  readonly state$ = this.refreshTrigger$.pipe(
    switchMap(() => this.loadUsersState$()),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private loadUsersState$() {
    const usersRequest$ = this.isSuperAdmin
      ? this.adminService.getUsers$()
      : of({ data: [] } satisfies UsersResponse);

    return usersRequest$.pipe(
      map((res: unknown) => (res as UsersResponse)?.data ?? []),
      map((users): AdminState => ({ loading: false, users, error: '' })),
      startWith({ loading: this.isSuperAdmin, users: [] as AdminUser[], error: '' } satisfies AdminState),
      catchError((err) =>
        of({
          loading: false,
          users: [] as AdminUser[],
          error: err?.error?.message ?? 'Sikertelen felhasználó lekérés.',
        } satisfies AdminState)
      )
    );
  }

  trackByUserId(_index: number, user: AdminUser) {
    return user.id;
  }

  isBusy(userId: number): boolean {
    return this.busyUserIds.has(userId);
  }

  activateUser(user: AdminUser) {
    if (!this.isSuperAdmin || this.isBusy(user.id)) return;
    this.busyUserIds.add(user.id);
    this.adminService
      .activateUser$(user.id)
      .pipe(finalize(() => this.busyUserIds.delete(user.id)))
      .subscribe({
        next: () => this.refreshTrigger$.next(),
        error: () => {},
      });
  }

  inactivateUser(user: AdminUser) {
    if (!this.isSuperAdmin || this.isBusy(user.id)) return;
    this.busyUserIds.add(user.id);
    this.adminService
      .inactivateUser$(user.id)
      .pipe(finalize(() => this.busyUserIds.delete(user.id)))
      .subscribe({
        next: () => this.refreshTrigger$.next(),
        error: () => {},
      });
  }

  deleteUser(user: AdminUser) {
    if (!this.isSuperAdmin || this.isBusy(user.id)) return;

    void Swal.fire({
      icon: 'warning',
      title: 'Biztosan törlöd?',
      text: 'A művelet nem visszavonható.',
      showCancelButton: true,
      confirmButtonText: 'Törlés',
      cancelButtonText: 'Mégse',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.busyUserIds.add(user.id);
      this.adminService
        .deleteUser$(user.id)
        .pipe(finalize(() => this.busyUserIds.delete(user.id)))
        .subscribe({
          next: () => this.refreshTrigger$.next(),
          error: () => {},
        });
    });
  }
}
