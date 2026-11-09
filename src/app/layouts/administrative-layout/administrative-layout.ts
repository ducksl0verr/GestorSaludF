import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  imports: [RouterLink, RouterModule],
  selector: 'app-administrative-layout',
  styleUrl: './administrative-layout.css',
  templateUrl: './administrative-layout.html',
})
export class AdministrativeLayout {}
