import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AdminService } from '../admin.service';
import { catchError, map, of, shareReplay, startWith } from 'rxjs';

type AdminUserQualification = {
  id: number;
  user_id: number;
  interest: string | null;
  qualification: string | null;
  experience: string | null;
  created_at: string | null;
  updated_at: string | null;
};

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
  organization_memberships?: unknown[];
  qualifications?: AdminUserQualification[];
};

type UsersResponse = {
  data: AdminUser[];
};

@Component({
  selector: 'app-admin',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  private readonly adminService = inject(AdminService);

  readonly isSuperAdmin = localStorage.getItem('role') === 'superadmin';

  readonly state$ = (this.isSuperAdmin
    ? this.adminService.getUsers$()
    : of({ data: [] } satisfies UsersResponse)
  ).pipe(
    map((res: unknown) => (res as UsersResponse)?.data ?? []),
    map((users) => ({ loading: false, users, error: '' })),
    startWith({ loading: this.isSuperAdmin, users: [] as AdminUser[], error: '' }),
    catchError((err) =>
      of({
        loading: false,
        users: [] as AdminUser[],
        error: err?.error?.message ?? 'Sikertelen felhasználó lekérés.',
      })
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  trackByUserId(_index: number, user: AdminUser) {
    return user.id;
  }
}
