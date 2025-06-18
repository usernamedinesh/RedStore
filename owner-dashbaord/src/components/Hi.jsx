import { useEffect } from "preact/hooks";
import { useAppContext } from "../customComponents/context";
import { CLIENT } from "../api";

export function Hi() {
  const { data } = useAppContext();
  // check if there is not token then redirect to login page
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      window.location.href = `${CLIENT}`;
    }
  }, [data.id]);
  return (
    <>
      <div>
        <div>
          <h1>hello</h1>
        </div>
      </div>
    </>
  );
}
