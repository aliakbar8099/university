import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { StudentService } from '@/module/Student/student.service';
import { StudentDto } from '@/module/Student/dto/student.dto';
import { STT as Student } from '@/module/Student/student.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('students') 
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() studentDto: StudentDto) {
    return this.studentService.create(studentDto);
  }

  @Get()
  async findAllStudentsWithDetails(): Promise<any[]> {
    return this.studentService.findAllStudentsWithDetails();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.studentService.findOneStudentWithDetails(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() studentData: Partial<Student>): Promise<Student> {
    return this.studentService.update(+id, studentData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.studentService.remove(+id);
  }
}
