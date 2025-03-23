import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'expense-tracker-ui-invite-user-form',
  imports: [
    CommonModule,
    FormlyModule,
    MatButton,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
    ReactiveFormsModule,
  ],
  templateUrl: './invite-user-form.component.html',
})
export class InviteUserFormComponent implements OnInit {
  inviteUserForm = this.fb.group({});
  fields: FormlyFieldConfig[] = [];
  model: any = {};

  @Output()
  invite = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fields = [
      {
        key: 'email',
        type: 'input',
        props: {
          label: 'Email',
          required: true,
          attributes: {
            'data-cy': 'user-email-input',
          },
        },
      },
    ];
  }

  onInvite() {
    this.invite.emit(this.model);

    this.inviteUserForm.reset();
  }
}
