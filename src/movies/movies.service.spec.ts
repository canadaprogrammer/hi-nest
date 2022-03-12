import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('Should return a movie', () => {
      service.create({
        title: "Test Movie",
        genres: ['test'],
        year: 2000,
      });

      const movie = service.getOne(1);
      expect(movie).toBeDefined();
    });
    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('remove', () => {
    it('Removes a movie', () => {
      service.create({
        title: "Test Movie1",
        genres: ['Test'],
        year: 2020,
      });
      service.create({
        title: "Test Movie2",
        genres: ['Test'],
        year: 2020,
      });
      const beforeRemove = service.getAll().length;
      service.remove(1);
      const aftterRemove = service.getAll().length;
      expect(aftterRemove).toBeLessThan(beforeRemove);
    });

    it('should throw 404 error', () => {
      try {
        service.remove(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: "Test Movie1",
        genres: ['Test'],
        year: 2020,
      });
      const afterCreate = service.getAll().length;
      console.log(beforeCreate, afterCreate);
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      service.create({
        title: "Test Movie1",
        genres: ['Test'],
        year: 2020,
      });

      service.update(1, {year: 2021});
      const movie = service.getOne(1);
      expect(movie.year).toEqual(2021);
    });

    it('should throw 404 error', () => {
      try {
        service.update(999, {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});