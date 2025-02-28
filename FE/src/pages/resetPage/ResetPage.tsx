import { ResetForm } from "../../components/resetForm/ResetForm.tsx";
import s from "./resetPage.module.css";

export const ResetPage = () => {
  return (
    <div className={s.resetPage}>
      <ResetForm />
    </div>
  );
};
