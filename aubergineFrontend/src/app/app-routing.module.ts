import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserSignUpComponent} from './user-sign-up/user-sign-up.component';
import {CovidComponent} from './covid/covid.component'

const routes: Routes = [
  { path: 'user-sign-up', component: UserSignUpComponent},
  { path: 'covid', component: CovidComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
