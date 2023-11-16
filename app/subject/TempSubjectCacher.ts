import Subject from "../database-interface/Subject.js";

class TempSubjectCacher {
  private subjectMap = new Map<string, Subject>();

  public cache(subject: Subject) {
    this.subjectMap.set(subject.subject, subject);
  }

  public get(subject: string): Subject | undefined {
    return this.subjectMap.get(subject);
  }
}

export default new TempSubjectCacher();
