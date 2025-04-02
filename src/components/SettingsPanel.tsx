import { ReactNode, useState } from "react";
import NumberInp from "./ui/NumberInp";
import SliderInp from "./ui/SliderInp";
import Button from "./ui/Button";
import InputCubeModal from "./InputCubeModal";

export default function SettingsPanel({
  size,
  setCubeSize,
  onScramble,
  onRotate,
  onReset,
  isAnimating,
}: {
  size: number;
  setCubeSize: (size: number) => void;
  onScramble: (count: number) => void;
  onReset: () => void;
  onRotate: (
    layerIndex: number,
    axis: "X" | "Y" | "Z",
    clockwise: boolean
  ) => void;
  isAnimating: boolean;
}) {
  const [layerIndex, setLayerIndex] = useState(0);
  const [axis, setAxis] = useState<"X" | "Y" | "Z">("X");
  const [clockwise, setClockwise] = useState<boolean>(false);
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [newSize, setNewSize] = useState<number>(size);

  function Seperator() {
    return (
      <div
        className="w-full h-0.5 rounded-full my-3"
        style={{ background: "var(--borderCol)" }}
      />
    );
  }
  function FlexBox({ children }: { children: ReactNode }) {
    return (
      <div className="flex flex-row justify-between items-center gap-2 mt-3">
        {children}
      </div>
    );
  }
  function BoxTitle({ title }: { title: string }) {
    return <div className="text-sm mt-3">{title}</div>;
  }
  return (
    <div className="mt-5 p-3">
      <FlexBox>
        <NumberInp
          max={10}
          min={2}
          def={newSize}
          steps={1}
          onChange={(ns) => setNewSize(ns)}
        />
        <Button onClick={() => setCubeSize(newSize)} disabled={isAnimating}>
          Set Size
        </Button>
      </FlexBox>
      <FlexBox>
        <Button
          onClick={() => onReset()}
          disabled={isAnimating}
          className="hover:bg-amber-600"
        >
          Reset Cube
        </Button>
        <Button onClick={() => setShowInputModal(true)} disabled={isAnimating}>
          Input Cube
        </Button>
      </FlexBox>
      <Seperator />
      <BoxTitle title="Animation Speed" />
      <FlexBox>
        <SliderInp
          def={Number(localStorage.getItem("anim"))}
          steps={5}
          min={0}
          max={500}
        />
      </FlexBox>
      <Seperator />
      <BoxTitle title="Scramble" />
      <FlexBox>
        <input
          style={{
            border: "1px solid var(--borderCol)",
          }}
          className="focus:outline-none rounded-[15px] w-20 h-10 p-2.5"
          placeholder="Count"
          defaultValue={Number(localStorage.getItem("scam"))}
          onChange={(e) =>
            localStorage.setItem("scam", e.target.value.toString())
          }
          disabled={isAnimating}
        />
        <Button
          onClick={() => onScramble(Number(localStorage.getItem("scam")))}
          disabled={isAnimating}
        >
          Scramble
        </Button>
      </FlexBox>
      <Seperator />
      <BoxTitle title="Move" />
      <FlexBox>
        <input
          placeholder="Layer"
          style={{
            border: "1px solid var(--borderCol)",
          }}
          defaultValue={layerIndex.toString()}
          className="focus:outline-none rounded-[15px] w-20 h-10 p-2.5"
          onFocus={(e) => (e.target.value = "")}
          onBlur={(e) => {
            const value = parseInt(e.target.value);
            if (value > size - 1) {
              setLayerIndex(size - 1);
            } else if (isNaN(value)) {
              setLayerIndex(0);
            } else {
              setLayerIndex(value);
            }
          }}
          disabled={isAnimating}
        />
        <Button
          joinRight={true}
          onClick={() => setAxis("X")}
          selected={axis === "X"}
        >
          X
        </Button>
        <Button
          joinLeft={true}
          joinRight={true}
          onClick={() => setAxis("Y")}
          selected={axis === "Y"}
        >
          Y
        </Button>
        <Button
          joinLeft={true}
          onClick={() => setAxis("Z")}
          selected={axis === "Z"}
        >
          Z
        </Button>
      </FlexBox>
      <FlexBox>
        <Button
          joinRight={true}
          onClick={() => setClockwise(true)}
          disabled={isAnimating}
          selected={clockwise}
        >
          CW
        </Button>
        <Button
          joinLeft={true}
          onClick={() => setClockwise(false)}
          disabled={isAnimating}
          selected={!clockwise}
        >
          CCW
        </Button>
        <Button
          onClick={() => onRotate(layerIndex, axis, clockwise)}
          disabled={isAnimating}
        >
          Move
        </Button>
      </FlexBox>
      {showInputModal && (
        <InputCubeModal onClose={() => setShowInputModal(false)} />
      )}
    </div>
  );
}
