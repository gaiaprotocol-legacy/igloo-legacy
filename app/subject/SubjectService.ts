import { SupabaseService } from "common-app-module";
import Subject, { SubjectsSelectQuery } from "../database-interface/Subject.js";

class SubjectService extends SupabaseService {
  constructor() {
    super("subjects", SubjectsSelectQuery, 50);
  }

  public async fetchSubject(subject: string): Promise<Subject | undefined> {
    const data = await this.safeFetch<Subject[]>((b) =>
      b.select(this.selectQuery).eq("subject", subject)
    );
    return data?.[0];
  }
}

export default new SubjectService();
