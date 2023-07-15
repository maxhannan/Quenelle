import { useState, type FC, useEffect } from "react";
import { IMAGE_URL } from "~/utils/images";
import Spinner from "../LoadingSpinner";
import { Eye, EyeIcon } from "lucide-react";
import { Link } from "@remix-run/react";

interface Props {
  imgSrcs: string[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageBar: FC<Props> = ({ imgSrcs, setIsOpen }) => {
  const [loaded, setLoaded] = useState(false);
  const [loadList, setLoadList] = useState<boolean[]>([]);

  useEffect(() => {
    if (imgSrcs.length === loadList.length) {
      setLoaded(true);
    }
  }, [loadList]);
  return (
    <div className="w-full flex flex-wrap  items-center justify-start gap-2 py-2 ">
      {imgSrcs.map((image, i) => (
        <div key={image} className="relative ">
          <Link key={i} to={`#item${i}`}>
            <div
              className="relative  w-[100px] flex items-center justify-center  overflow-hidden  rounded-xl group "
              onClick={() => setIsOpen(true)}
            >
              {!loaded && <Spinner size={6} />}
              <img
                onLoad={(e) => setLoadList((prev) => [...prev, true])}
                src={[IMAGE_URL, image, "preview"].join("/")}
                alt="Default avatar"
              />
              {/* faded overlaty */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40  transition-all duration-300" />
              <div className="absolute inset-0 opacity-0  items-center justify-center group-hover:opacity-100  flex transition-all duration-150">
                <EyeIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ImageBar;
