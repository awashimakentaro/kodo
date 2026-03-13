import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  selectDate: z.string().min(1, "日付を選択してください"), //selectDateというフィールド名をここで定義している
});
type FormValues = z.infer<typeof schema>; //ここで型を生成し
// type FormValues = {
//     selectDate: string
//   }これが生成結果

export const UserPrevPost = () => {
  const {
    //これはRHFの初期設定
    register, //inputとrhfを紐づける関数これがないとそもそも始まらない
    watch, //フォーム入力が変わるたびにその値を返すサイレンだ
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema), //schemaのルールや形を受容したregister watch formstateが作られる
    defaultValues: { selectDate: "" },
  });
  // UseFormProps = {　RHFにわたせるprops
  //     resolver
  //     defaultValues
  //     mode
  //     reValidateMode
  //     criteriaMode
  //     shouldFocusError
  //   }
  //見にくいけど文法としては　const {a, b, c} = useForm() みたいなもん分割代入

  const selectDate = watch("selectDate"); // これで値取得

  return (
    <div className="mt-4">
      <label className="mb-2 block text-xs font-medium text-slate-500">
        日付を選択して過去の投稿を確認しよう
      </label>
      <input
        type="date"
        {...register("selectDate")}
        className="h-11 w-full rounded-xl border border-slate-100 bg-white px-4 text-sm text-slate-700 shadow-sm outline-
none"
      />
      {errors.selectDate && (
        <p className="mt-2 text-xs text-red-500">{errors.selectDate.message}</p>
      )}
    </div>
  );
};
//jsにてA && B とAがtrueの時Bを実行AがFalseなら何も返さない
// React Hook Form の内部
// errors = {
//   selectDate: {
//     type: "min",
//     message: "日付を選択してください"
//   }
// }
// つまりerrors.selectDateが存在する = バリデーションエラーがある
