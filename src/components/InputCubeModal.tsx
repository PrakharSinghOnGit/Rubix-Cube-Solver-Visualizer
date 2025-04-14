import Button from "./ui/Button";
import { CubeType } from "../types";

interface InputCubeModalProps {
  onClose: () => void;
  onSubmit?: (cubeState: CubeType) => void;
}

export default function InputCubeModal({ onClose }: InputCubeModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Input Cube State</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Enter the current state of your cube by selecting colors for each
            face.
          </p>

          {/* Here you would implement the UI for selecting colors for each face */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {/* This is a placeholder for the cube input interface */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              Top Face
            </div>
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              Front Face
            </div>
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              Right Face
            </div>
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              Back Face
            </div>
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              Left Face
            </div>
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              Bottom Face
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancel
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
