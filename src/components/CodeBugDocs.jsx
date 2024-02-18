import CodeCard from "./CodeCard";

function CodeBugDocs() {
  const ExamplesCodes = [
    {
      title: "Gramatica 1",
      content: [
        {
          subtitle: "Cadena",
          code: `let array [0,1,2,3,4];`,
        },
      ],
    },
  ];

  return (
    <>
      <div>
        <div>
          {ExamplesCodes.map((example, index) => {
            return (
              <CodeCard
                key={index}
                title={example.title}
                content={example.content}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default CodeBugDocs;
