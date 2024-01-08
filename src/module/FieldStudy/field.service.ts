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

  async findAllFieldWithDetails(): Promise<any[]> {
    return this.FSRepository
      .createQueryBuilder('FieldStudy')
      .leftJoinAndSelect('FieldStudy.university', 'university')
      .select([
        'FieldStudy.FSID',
        'FieldStudy.FSName',
        'university.UniversityName',
        'university.UniversityID'
      ])
      .getMany();
  }


  async findOneFieldWithDetails(id: number): Promise<any[]> {
    return this.FSRepository
      .createQueryBuilder('FieldStudy')
      .leftJoinAndSelect('FieldStudy.university', 'university')
      .where('FieldStudy.FSID = :id', { id })
      .select([
        'FieldStudy.FSID',
        'FieldStudy.FSName',
        'university.UniversityName',
        'university.UniversityID',
      ])
      .getMany();
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
