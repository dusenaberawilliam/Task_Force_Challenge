### Installation
- Download Node JS => [https://nodejs.org/en/]
- Download git => [https://git-scm.com/downloads]
- Clone this repository => [https://github.com/dusenaberawilliam/Task_Force_Challenge.git]
- npm install

### Port and Localhost
* http://localhost:5000 and then add among the following APIs

### Setting email
* If you gmail, remember that Gmail has came up with the concept of “Less Secure” apps which is basically anyone who uses plain password to login to Gmail, so you might end up in a situation where one username can send mail (support for “less secure” apps is enabled)
* To enable it, just login with the email you want to use to send message and open new tab in the same browser used during logging in, but make sure you remained logged in and paste the following link in that new tab => => =>
=> [https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4NGkGfYHPKo2GTHJ78rs2p2ILuJEhpPYXs1xV9B3IbTAzR6vB6xO0IvHm5sxF1HWpml05XSpQc11UtL0JwyBgnIOaH23g]

### Rest API

Manager signing up or in
* POST /api/    ***This is used for manager sign up***
* POST /api/login   ***This is used for manager log in***
* PUT /api/employee/restPassword/:code   ***This is used for resting password and after go to email to confirm***
[To_Access_This_API_You_need_to_login_as_Manager]
    ***Remeber to to set the headers ***
        Ex: key= accessToken and value=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.....
Employee management API
* GET /api/employee/  ***Use this API to get the List of all employees***
* POST /api/employee/   ***Use this API to create or insert an employee***
* PUT /api/employee/status/:code   ***Use this to update or edit status of employee***
* PUT /api/employee/suspend/:code   ***Use this to SUSPEND an employee***
* PUT /api/employee/update/:code    ***Just use this API to update or edit an data about employee***
* DELETE /api/employee/:code    ***This API is used to DELETE an employee***
* GET /api/employee/search/:data    ***Use this API to search employee using CODE, NAME, POSITION, EMAIL or PHONE***
* GET /api/employee/verify/:code    ***This API is attached to the EMAIL LINK to confirm the email***
* POST /api/employee/importfromexcel    ***Specify the url of excel file to save the file as shown bellow with example***
    EX: 
        {
        "excelLink" : "C:/Users/Willy/Documents/Book.xlsx"
        }
**++++++++++++++++++++++++++++++++++++++ NB +++++++++++++++++++++++++++++++++++++++++++++++++**
* NB : To test this API use a file named [postman.json] and use examples of json found in it
**+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++**

### Technology tools used in this Project
* Server side Framework : ***NodeJS/Express***
* Database: ***MySQL***
