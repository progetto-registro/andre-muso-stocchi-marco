import type { Studente } from "../../models/Studente";

type EditStudentProps = {
  studenteInModifica: Studente | undefined;
  onSaved: (studente: Studente) => void;
  onCancel: () => void;
  onDelete: (studente: Studente) => void;
};

export default function EditStudent({
  studenteInModifica,
  onSaved,
  onCancel,
  onDelete,
}: EditStudentProps) {
  return <></>;
}
