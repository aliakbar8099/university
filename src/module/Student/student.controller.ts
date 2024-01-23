import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { StudentService } from '@/module/Student/student.service';
import { StudentDto } from '@/module/Student/dto/student.dto';
import { STT as Student } from '@/module/Student/student.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() studentDto: StudentDto) {
    return this.studentService.create(studentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllStudentsWithDetails(@Query('userId') userId: number): Promise<any[]> {
    return this.studentService.findAllStudentsWithDetails(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.studentService.findOneStudentWithDetails(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('term/:userId')
  async findAllTerm(@Param('userId') userId: string): Promise<any> {
    return this.studentService.findAllUserTerm(+userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() studentData: Partial<Student>): Promise<Student> {
    return this.studentService.update(+id, studentData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.studentService.remove(+id);
  }
}
