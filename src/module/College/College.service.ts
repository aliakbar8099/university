import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { College } from "./College.entity"

@Injectable()
export class CollegeService {
  constructor(
    @InjectRepository(College)
    private readonly CollegeRepository: Repository<College>,
  ) { }

  /*
    INSERT INTO College (CollegeName)
    VALUES (@CollegeName)
  */
  async create(CollegeData: Partial<College>): Promise<College> {
    const College = this.CollegeRepository.create(CollegeData);
    return await this.CollegeRepository.save(College);
  }

  /*
    SELECT * FROM College
  */
    async findAll(page: number = 1, itemsPerPage: number = 12, searchTerm: string = ""): Promise<College[]> {

      const skip = (page - 1) * itemsPerPage;
      return await this.CollegeRepository
          .createQueryBuilder("c")
          .select([
              "CollegeID as id",
              "CollegeName",
          ])
          .where(`CollegeName LIKE N'%${searchTerm}%'`)
          .skip(skip)
          .take(itemsPerPage)
          .getRawMany();
  }
  /*
    SELECT * FROM College WHERE CollegeID = @CollegeID;
  */
  async findOne(id: number): Promise<College> {
    const College = await this.CollegeRepository.findOne({
      where: { CollegeID: id },
    });

    if (!College) {
      throw new NotFoundException(`College with ID ${id} not found`);
    }
    return College;
  }

  /*
    SELECT * FROM College WHERE CollegeID = @CollegeID;
  */
  async update(id: number, CollegeData: Partial<College>): Promise<College> {
    await this.findOne(id); // Check if the College exists
    await this.CollegeRepository.update(id, CollegeData);
    return await this.findOne(id);
  }

  /*
   UPDATE College
   SET CollegeName = @CollegeName
   WHERE STID = @STID;
  */
  async remove(id: number): Promise<void> {
    const College = await this.findOne(id);
    await this.CollegeRepository.remove(College);
  }
}
