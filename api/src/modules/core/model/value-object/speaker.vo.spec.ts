import { SpeakerVOSchema } from './speaker.vo';

describe('(unit) SpeakerVO', () => {
  it('should create and validate instance', () => {
    expect(SpeakerVOSchema.safeParse({ value: 'John' }).success).toBeTruthy();
  });

  it('should fail to validate empty string', () => {
    expect(SpeakerVOSchema.safeParse({ value: '' }).success).toBeFalsy();
  });

  it('should fail to validate too long string', () => {
    expect(
      SpeakerVOSchema.safeParse({
        value: `${Array.from({ length: 101 }, () => 'a').join()}`,
      }).success,
    ).toBeFalsy();
  });
});
