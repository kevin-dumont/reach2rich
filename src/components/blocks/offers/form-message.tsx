export const FormMessage = ({ error }: { error: string[] | undefined }) => {
  return (
    <>
      {error && (
        <div className="text-red-500 mt-2 text-sm">
          {error.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </>
  );
};
