import type { Lezione } from "../../models/Lezione";

type EditLessonProps = {
  lezioneInModifica: Lezione | undefined;
  onSaved: (lezione: Lezione) => void;
  onCancel: () => void;
};

export default function EditLesson({
  lezioneInModifica,
  onSaved,
  onCancel,
}: EditLessonProps) {
  return <></>;
}
