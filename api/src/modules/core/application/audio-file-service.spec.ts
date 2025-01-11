import { AudioFileService } from './audio-file-service';

describe('(unit) AudioFileService', () => {
  it('should use provided params and return filename', () => {
    expect(AudioFileService.getFilename('og.mp4', 'name', 'wav')).toStrictEqual(
      {
        name: 'name',
        extension: 'wav',
      },
    );
  });

  it('should use original name to infer filename', () => {
    expect(AudioFileService.getFilename('test.mp4')).toStrictEqual({
      name: 'test',
      extension: 'mp4',
    });
  });

  it('should default to mp3 extension', () => {
    expect(AudioFileService.getFilename('test')).toStrictEqual({
      name: 'test',
      extension: 'mp3',
    });
  });
});
