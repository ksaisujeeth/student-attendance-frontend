Steps I have done:

cd StudentAttendanceFrontend
ng new student-attendance-app
cd student-attendance-app

mkdir src/app/models
mkdir src/app/services
mkdir src/app/components
mkdir src/app/pages
mkdir src/app/shared

mkdir src/app/components/student
mkdir src/app/components/attendance
mkdir src/app/components/header
mkdir src/app/components/sidebar
mkdir src/app/shared/components


mkdir src/app/pages/student-list
mkdir src/app/pages/student-form
mkdir src/app/pages/attendance-list
mkdir src/app/pages/attendance-form
mkdir src/app/pages/dashboard
mkdir src/app/pages/reports


mkdir src/app/services/student
mkdir src/app/services/attendance


Models -->
    attendance.model
    error-response.model
    student.model
Services-->
    attendance.service
    student.service
pages:
    student-list
    student-form
    attendance-list
    attendance-form
    dashboards
    reports

app:
    app.routes.ts
    app.component.ts
    app.component.html
    app.component.css

npm install bootstrap@5.3.0

style.css

cd D:\saisujeeth\SpringBootPractice\StudentAttendanceFrontend\student-attendance-app (front end folder path)
dir (should see some files like angular.json)
npm install
ng serve



