import Title from "@/components/Title";
import { Card } from "@/components/ui/card";

const NotFound404Page = (): JSX.Element => {
  return (
    <div className="min-h-screen">
      <Card className="text-center max-w-xl m-auto mt-[20%] p-5 ">
        <Title>404 - Page non trouvée</Title>
        <p className="text-lg mb-6">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
      </Card>
    </div>
  );
};

export default NotFound404Page;
