export default function InputOutput({ inp, out }) {
  return (
    <div className="flex flex-col lg:flex-row justify-between ml-0 mr-auto min-w-[200px] shadow-xl p-4 my-2 border-2 hover:shadow-lg dark:bg-gray-800 rounded-xl">
      <div className="w-2/5">
        <h4 className="font-medium text-lg dark:text-gray-300">Input</h4>
        <pre>{inp}</pre>
      </div>
      <div className="lg:hidden h-[10px]"></div>
      <div className="w-2/5">
        <h4 className="font-medium text-lg dark:text-gray-300">Output</h4>
        <pre>{out}</pre>
      </div>
    </div>
  );
}
