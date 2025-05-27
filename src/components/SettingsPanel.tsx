import { ReactNode, useState } from "react";
import NumberInp from "./ui/NumberInp";
import SliderInp from "./ui/SliderInp";
import Button from "./ui/Button";
import InputCubeModal from "./InputCubeModal";

export default function SettingsPanel({
  size,
  setCubeSize,
  onScramble,
  onUserMoves,
  onReset,
  isAnimating,
  isSolving = false,
}: {
  onScramble: (count: number) => void;
  onUserMoves: (moves: string[]) => void;
  size: number;
  setCubeSize: (size: number) => void;
  onReset: () => void;
  isAnimating: boolean;
  isSolving?: boolean;
}) {
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [newSize, setNewSize] = useState<number>(size);
  const isDisabled = isAnimating || isSolving;
  const [moves, setMoves] = useState<string>("");
  const [scam, setScam] = useState<number>(20);
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
        <Button
          filled={true}
          onClick={() => setCubeSize(newSize)}
          disabled={isDisabled}
        >
          Set Size
        </Button>
      </FlexBox>
      <FlexBox>
        <Button
          onClick={() => onReset()}
          disabled={isDisabled}
          className="hover:bg-amber-600"
        >
          Reset Cube
        </Button>
        <Button onClick={() => setShowInputModal(true)} disabled={isDisabled}>
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
          max={1000}
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
          defaultValue={scam}
          onChange={(e) => setScam(Number(e.target.value))}
          disabled={isDisabled}
        />
        <Button onClick={() => onScramble(scam)} disabled={isDisabled}>
          Scramble
        </Button>
      </FlexBox>
      <Seperator />
      <BoxTitle title="Move" />
      <FlexBox>
        <input
          placeholder="Moves"
          style={{
            border: "1px solid var(--borderCol)",
          }}
          className="focus:outline-none rounded-[15px] w-full h-10 p-2.5"
          onChange={(e) => {
            setMoves(e.target.value);
          }}
        />
      </FlexBox>
      <FlexBox>
        <Button
          disabled={isDisabled}
          onClick={() => onUserMoves(moves.split(" "))}
        >
          Apply
        </Button>
      </FlexBox>
      {showInputModal && (
        <InputCubeModal onClose={() => setShowInputModal(false)} />
      )}
    </div>
  );
}
