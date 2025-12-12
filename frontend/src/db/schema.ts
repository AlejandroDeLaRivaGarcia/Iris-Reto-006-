import { pgTable, text, integer, primaryKey, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- Users ---
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  phone: text('phone'),
});

export const usersRelations = relations(users, ({ many }) => ({
  subjects: many(userSubjects),
}));

// --- Subjects ---
export const subjects = pgTable('subjects', {
  code: text('code').primaryKey(), // String PK
  name: text('name'),
});

export const subjectsRelations = relations(subjects, ({ many }) => ({
  subscribers: many(userSubjects),
  teachers: many(teacherSubjects),
}));

// --- Teachers ---
export const teachers = pgTable('teachers', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const teachersRelations = relations(teachers, ({ many }) => ({
  subjects: many(teacherSubjects),
}));

// --- Association Tables ---

// User <-> Subject (Many-to-Many)
export const userSubjects = pgTable('user_subjects', {
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subjectCode: text('subject_code').notNull().references(() => subjects.code, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.subjectCode] }),
}));

export const userSubjectsRelations = relations(userSubjects, ({ one }) => ({
  user: one(users, {
    fields: [userSubjects.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [userSubjects.subjectCode],
    references: [subjects.code],
  }),
}));

// Teacher <-> Subject (Many-to-Many)
export const teacherSubjects = pgTable('teacher_subjects', {
  teacherId: integer('teacher_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
  subjectCode: text('subject_code').notNull().references(() => subjects.code, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.teacherId, t.subjectCode] }),
}));

export const teacherSubjectsRelations = relations(teacherSubjects, ({ one }) => ({
  teacher: one(teachers, {
    fields: [teacherSubjects.teacherId],
    references: [teachers.id],
  }),
  subject: one(subjects, {
    fields: [teacherSubjects.subjectCode],
    references: [subjects.code],
  }),
}));
