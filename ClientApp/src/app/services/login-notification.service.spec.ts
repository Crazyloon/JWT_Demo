import { TestBed, inject } from '@angular/core/testing';

import { LoginNotificationService } from './login-notification.service';

describe('LoginNotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginNotificationService]
    });
  });

  it('should be created', inject([LoginNotificationService], (service: LoginNotificationService) => {
    expect(service).toBeTruthy();
  }));
});
