import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-user-sign-up',
  templateUrl: './user-sign-up.component.html',
  styleUrls: ['./user-sign-up.component.css']
})
export class UserSignUpComponent implements OnInit {

  constructor(private dataService: DataService,private router:Router) { }

  user_signup = {
    'email': '',
    'password': '',
  }

  user_profile_data = {
    'user': '',
    'first_name': '',
    'last_name': '',
    'country': ''
  }

  ngOnInit(): void {
    localStorage.removeItem("email");
    localStorage.removeItem("country");
    localStorage.removeItem('code');
  }

  submitSignUpData(firstname: any, lastname: any, email_id: any, pass: any, cpass: any, country: any) {
    if(pass != cpass){
      window.alert('Password and Confirm Password does not match...')
      return
    }
    this.user_signup.email = email_id;
    this.user_signup.password = pass;
    this.user_profile_data.first_name = firstname;
    this.user_profile_data.last_name = lastname;
    this.user_profile_data.country = country;
    this.sendSignUpData()
  }

  user_data: any = []
  sendSignUpData() {
    this.dataService.sendSignUpData(this.user_signup).subscribe(
      (data) => {

        if ("User already exist!" == data) {
          window.alert('User Already Exists...')
        } else if ("Invalid Serializer" == data) {
          window.alert(data)
        } else {

          this.user_data = data;
          this.user_profile_data.user = this.user_data[0]['id']
          this.dataService.sendProfileData(this.user_profile_data).subscribe(
            (data) => {
              if ("Invalid Serializer" == data) {
                window.alert('Internal Error Occured while adding user...')
              }else{
                localStorage.setItem('email',this.user_signup.email)
                localStorage.setItem('country',this.user_profile_data.country)
                window.alert(data)
                this.router.navigateByUrl('/covid')
              }
            }
          );

        }
      }

    );
  }

}
