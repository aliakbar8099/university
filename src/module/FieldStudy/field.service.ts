import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FieldStudy } from "./field.entity"

@Injectable()
export class FieldStudyService {
  constructor(
    @InjectRepository(FieldStudy)
    private readonly FSRepository: Repository<FieldStudy>,
  ) { }

  /*
    INSERT INTO FieldStudy (UniversityName)
    VALUES (@UniversityName)
  */
  async create(FSData: Partial<FieldStudy>): Promise<FieldStudy> {
    const FS = this.FSRepository.create(FSData);
    return await this.FSRepository.save(FS);
  }

  /*
    SELECT * FROM FieldStudy
  */
  async findAll(): Promise<FieldStudy[]> {
    return await this.FSRepository.find();
  }

  /*
  SELECT
    f.FSID,
    f.FSName,
    u.STEIDName,
  FROM
    FieldStudy f
  JOIN
    STEID u ON u.STEID = f.STEID
*/

  async findAllFieldWithDetails(page: number = 1, itemsPerPage: number = 12, searchTerm: string = "", paramValue1: number): Promise<any[]> {
    
    const offset = (page - 1) * itemsPerPage;

    return this.FSRepository
      .createQueryBuilder('F')
      .select([
        "F.FSID as id",
        "F.FSName as FSName",
        'College.CollegeName as fk_CollegeID',
      ])
      .innerJoin('F.College', 'College')
      .where(`F.FSName LIKE N'%${searchTerm}%'`)
      .where(!!paramValue1 ? `F.fk_CollegeID = ${paramValue1}` : ``)
      .offset(offset)
      .limit(itemsPerPage)
      .getRawMany();
  }



  async findOneFieldWithDetails(id: number): Promise<any[]> {
    return this.FSRepository
      .createQueryBuilder('F')
      .select([
        "F.FSID as id",
        "F.FSName as FSName",
        'College.CollegeName as fk_CollegeID',
      ])
      .innerJoin('F.College', 'College')
      .where('F.FSID = :id', { id })
      .getRawOne();
  }

  /*
    SELECT * FROM FS WHERE UniversityID = @UniversityID;
  */
  async findOne(id: number): Promise<FieldStudy> {
    const FS = await this.FSRepository.findOne({
      where: { FSID: id },
    });

    if (!FS) {
      throw new NotFoundException(`Field Study with ID ${id} not found`);
    }
    return FS;
  }

  /*
    SELECT * FROM FieldStudy WHERE UniversityID = @UniversityID;
  */
  async update(id: number, universityData: Partial<FieldStudy>): Promise<FieldStudy> {
    await this.findOne(id); // Check if the FS exists
    await this.FSRepository.update(id, universityData);
    return await this.findOne(id);
  }

  /*
   UPDATE FieldStudy
   SET UniversityName = @UniversityName
   WHERE STID = @STID;
  */
  async remove(id: number): Promise<void> {
    const FS = await this.findOne(id);
    await this.FSRepository.remove(FS);
  }
}
