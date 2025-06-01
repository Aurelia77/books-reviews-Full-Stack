import Title from "@/components/Title";
import { Card } from "@/components/ui/card";

const NotFound404Page = (): JSX.Element => {
  return (
    <div className="min-h-screen">
      <Card className="m-auto mt-[20%] max-w-xl p-5 text-center ">
        <Title>404 - Page non trouvée</Title>
        <p className="mb-6 text-lg">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
      </Card>
    </div>
  );
};

export default NotFound404Page;
