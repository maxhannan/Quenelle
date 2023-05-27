import { FC, useState } from "react";
import TextInput from "../formInputs/TextInput";
import PrepCalendar from "~/routes/app.prep._index/components/PrepCalendar";
import { Checkbox } from "../ui/checkbox";
import LoadingButton from "../buttons/LoadingButton";
import { ArrowRightIcon } from "lucide-react";

interface Props {}

const PrepListForm: FC<Props> = ({}) => {
  const [date, setDate] = useState<Date | undefined>(new Date(Date.now()));
  const handleDateChange = (date: Date) => {
    setDate(date);
  };

  return (
    <div className="flex flex-col gap-3 mt-2 relative">
      <div className="flex  gap-2">
        <TextInput name="listName" placeholder="Prep List Name" />
        <div className=" flex-none">
          <PrepCalendar date={date} handleDateChange={handleDateChange} />
        </div>
      </div>
    </div>
  );
};

export default PrepListForm;
