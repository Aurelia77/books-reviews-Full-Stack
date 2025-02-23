import FeedbackMessage from "@/components/FeedbackMessage";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import {
  addBookFirebase,
  deleteAllDatas,
  getDocsByQueryFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import {
  BookStatusEnum,
  BookType,
  MyInfoBookFormType,
  UserType,
} from "@/types";
import { useEffect, useState } from "react";

const DATA_BOOKS: BookType[] = [
  {
    id: "fW2xEAAAQBAJ",
    title: "Son odeur après la pluie",
    authors: ["Cédric Sapin-Defour"],
    description:
      "C’est une histoire d’amour, de vie et de mort. Sur quel autre trépied la littérature danse-t-elle depuis des siècles ? Dans Son odeur après la pluie, ce trépied, de surcroît, est instable car il unit deux êtres n’appartenant pas à la même espèce : un homme et son chien. Un bouvier bernois qui, en même temps qu’il grandit, prend, dans tous les sens du terme, une place toujours plus essentielle dans la vie du narrateur.Ubac, c’est son nom (la recherche du juste nom est à elle seule une aventure), n’est pas le personnage central de ce livre, Cédric Sapin-Defour, son maître, encore moins. D’ailleurs, il ne veut pas qu’on le considère comme un maître. Le héros, c’est leur lien. Ce lien unique, évident et, pour qui l’a exploré, surpassant tellement d’autres relations. Ce lien illisible et inutile pour ceux à qui la compagnie des chiens n’évoque rien. Au gré de treize années de vie commune, le lecteur est invité à tanguer entre la conviction des uns et l’incompréhension voire la répulsion des autres ; mais nul besoin d’être un homme à chiens pour être pris par cette histoire car si pareil échange est inimitable, il est tout autant universel. Certaines pages, Ubac pue le chien, les suivantes, on oublie qu’il en est un et l’on observe ces deux êtres s’aimant tout simplement.C’est bien d’amour dont il est question. Un amour incertain, sans réponse mais qui, se passant de mots, nous tient en haleine. C’est bien de vie dont il est question. Une vie intense, inquiète et rieuse où tout va plus vite et qu’il s’agit de retenir. C’est bien de mort dont il est question. Cette chose dont on ne voudrait pas mais qui donne à l’existence toute sa substance. Et ce fichu manque. Ces griffes que l’on croit entendre sur le plancher et cette odeur, malgré la pluie, à jamais disparue.",
    categories: ["Fiction / Literary", "Fiction / General"],
    pageCount: 270,
    publishedDate: "2023-03-29",
    publisher: "Stock",
    imageLink:
      "http://books.google.com/books/publisher/content?id=fW2xEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71VtGnh_FhexoU5kkTndBNcIGq-YlbG2ZrE9CexvpV_Fin9qeAclOih3POPc1K1yTkl_QneMf1iSJFXiFfrzAxVfkVtMPdzFHq6_TcdIjqa0PTfdOcRC1fsXmy0FYlDesqU5KDZ&source=gbs_api",
    language: "fr",
    isFromAPI: true,
    rating: { totalRating: 0, count: 0 },
  },
  {
    id: "lA7MDwAAQBAJ",
    title: "Aliénor d'Aquitaine, T1 : L'Été d'une reine",
    authors: ["Elizabeth Chadwick", "Alain Sainte-Marie", "Anne-Claire Payet"],
    description:
      "<p>« Votre père souhaitait pour vous un mariage qui fît honneur à votre personne et à l'Aquitaine, tout en vous hissant jusqu'aux plus hautes dignités. Il désirait également la sécurité et la paix pour vous-même et vos terres. Avant de partir, il a demandé au roi de France d'assurer votre sauvegarde. Dans ce but, il a arrangé un mariage entre vous et Louis, son héritier. Un jour, vous serez reine de France et, si Dieu le veut, à l'origine d'une dynastie de souverains dont le royaume s'étendra de Paris aux Pyrénées. »</p><p></p><p>Jeune, belle et vive d'esprit, Aliénor est promise à un somptueux avenir en tant que future duchesse d'Aquitaine. Mais lorsque son père meurt subitement lors de l'été 1137, elle rentre du jour au lendemain dans l'âge adulte. Contrainte d'épouser le jeune prince Louis de France, Aliénor peine à s'accoutumer à son nouveau rôle tandis qu'ils accèdent tous deux au trône de France. Aliénor devra désormais renoncer à la vie qu'elle a menée jusque-là pour affronter les intrigues de la Cour.</p><p></p><p>Figure emblématique de l'histoire de France et de l'Angleterre, Aliénor d'Aquitaine fascine depuis plus de huit cents ans. S'appuyant sur les toutes dernières découvertes des historiens, Elizabeth Chadwick redonne vie à ce personnage d'exception comme jamais auparavant.</p><p></p><p>« Elizabeth Chadwick fait partie de ces auteurs qui savent comment rendre l'Histoire vivante. » The Times</p><p></p><p>« Ouvrir un livre d'Elizabeth Chadwick, c'est s'embarquer pour un fabuleux voyage. Cette autrice sait camper comme personne des personnages convaincants et les faire évoluer avec maestria à travers le temps et l'espace. » Daily Telegraph</p><p></p><p>« La réputation d'Elizabeth Chadwick n'est plus à faire. Avec ce nouveau roman historique, elle nous révèle les arcanes des luttes de pouvoir et de la guerre des sexes à travers les yeux de cette femme remarquable que fut Aliénor d'Aquitaine. » New York Post</p><p></p><p>« Elizabeth Chadwick s'impose comme la meilleure autrice de romans médiévaux de ces dix dernières années. » Historical Novels Revie</p><p></p><p>« Un roman historique très bien documenté qui n'oublie pas d'être divertissant et sensuel. » Daily Mail</p>",
    categories: [
      "Fiction / Historical / General",
      "Fiction / Historical / Medieval",
    ],
    pageCount: 270,
    publishedDate: "2023-03-29",
    publisher: "Stock",
    imageLink:
      "http://books.google.com/books/publisher/content?id=lA7MDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73cdkZnHKh7h01kIc8R-8_nNlXZezx7eruyEZ3VgGeIchWHI6xpnIdfoHS76l_6_INePJ8F4YMIybjXjekkkRLY_VhozTxThA3LmERat_eHQsH_GmtpTJkSxsEapfqx-LUWKvbB&source=gbs_api",
    language: "fr",
    isFromAPI: true,
    rating: { totalRating: 0, count: 0 },
  },
  {
    id: "ZwboDwAAQBAJ",
    title: "Aliénor d'Aquitaine, T2 : L'Automne d'une reine",
    authors: ["Elizabeth Chadwick", "Alain Sainte-Marie", "Anne-Claire Payet"],
    description:
      "<p>« La meilleure autrice de romans médiévaux de ces dix dernières années. » Historical Novels Review</p><p></p><p>Derrière la reine légendaire se cache une femme d'exception.</p><p>1154. Aliénor est couronnée reine d'Angleterre aux côtés de son époux, le jeune Henri II Plantagenêt. Elle est désormais l'une des femmes les plus puissantes d'Europe. Tandis que Henri part en guerre contre les ennemis de la Couronne afin d'asseoir son autorité, Aliénor se révèle une souveraine active sur tous les fronts et une mère dévouée pour leurs nombreux enfants. Mais bientôt délaissée par Henri, qui lui préfère sa jeune amante, Aliénor se voit peu à peu déposséder du pouvoir qui est sien. Alors que la rébellion couve au sein de la famille royale, Aliénor découvre à ses dépens que même une reine doit constamment se battre pour conserver sa place.</p><p></p><p>Figure emblématique de l'histoire de France et de l'Angleterre, Aliénor d'Aquitaine fascine depuis plus de huit cents ans. S'appuyant sur les toutes dernières découvertes des historiens, Elizabeth Chadwick redonne vie, comme jamais auparavant, à ce personnage d'exception.</p><p></p><p>« Ouvrir un livre d'Elizabeth Chadwick, c'est s'embarquer pour un fabuleux voyage. Cette autrice sait camper comme personne des personnages convaincants et les faire évoluer avec maestria à travers le temps et l'espace. » Daily Telegraph</p><p>« Elizabeth Chadwick allie souci du détail historique et tension dramatique en un roman d'une grande fraîcheur riche en émotions. » Mail on Sunday</p><p>« Un pur plaisir de lecture ! » Daily Mail</p><p>« Une grande exactitude historique au service d'un récit puissant. » Woman & Home</p><p>« Des personnages au caractère bien trempé qui nous entraînent au travers des vicissitudes de l'Histoire. » Daily Telegraph</p>",
    categories: ["Fiction / Literary", "Fiction / General"],
    pageCount: 270,
    publishedDate: "2023-03-29",
    publisher: "Stock",
    imageLink:
      "http://books.google.com/books/publisher/content?id=ZwboDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71O5174y3AEytNlk-k6dVxFpFz-YcbsjLQJPwBFfxVZ3-1-FpDPdxb7Vc89upeO9mbpgp3ekmAH5V81yoSXeTB0pthA_G-HoWiMFlafQ_Q8pFtM7DEVf8xctRPjRD7_FIlvB_i8&source=gbs_api",
    language: "fr",
    isFromAPI: true,
    rating: { totalRating: 0, count: 0 },
  },
  {
    id: "OGahkZCah7sC",
    title: "The Chocolate Touch",
    authors: ["Laura Florand"],
    description:
      "<b>“Emotionally intense... Highly complex characters... Readers will cheer for both of them to work past their issues and find their chocolaty ever after.” —<i>Publishers Weekly</i>, starred review</b><br> <br> Dominique Richard’s reputation says it all—wild past, wilder flavors, black leather and smoldering heat. Jaime Corey is hardly the first woman to be drawn to all that dark, delicious danger. Sitting in Dom’s opulent chocolaterie in Paris day after day, she lets his decadent creations restore her weary body and spirit, understanding that the man himself is entirely beyond her grasp.<br> <br> Until he touches her...<br><br> Chocolate, Dominique understands—from the biting tang of lime-caramel to the most complex infusions of jasmine, lemon-thyme, and cayenne. But this shy, freckled American who sits alone in his salon, quietly sampling his exquisite confections as if she can’t get enough of them—enough of him—is something else. She has secrets too, he can tell. Of course if she really knew him, she would run.<br><br> Yet once you have spotted your heart’s true craving, simply looking is no longer enough...<br><br><b>Praise for the writing of Laura Florand</b><br><br> “I adored this story... Paris, chocolate, and romance, all in one hilarious package.” —<i>New York Times–</i>bestselling author Eloisa James<br><br> “Readers will devour this frothy, fun novel.” —<i>Booklist</i><br><br> “Both sensual and sweet.... A story that melts in your mouth!” —<i>USA Today–</i>bestselling author Christie Ridgway<br> <br> “Vive la Laura Florand!” —Cassandra King",
    categories: [
      "Fiction / Romance / Romantic Comedy",
      "Fiction / Women",
      "Fiction / Romance / Contemporary",
    ],
    pageCount: 270,
    publishedDate: "2023-03-29",
    publisher: "Stock",
    imageLink:
      "http://books.google.com/books/content?id=OGahkZCah7sC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE7131C0PclFewOhkppUkpAuVYmWgKqq5YieYPc-CH4MIJN_tnvt0dD5zQ0DK6I89UI7xhSHrV4arCHUlT-agJsFR_N3nNSfFU4wiKXYUI4_pdPs_JLh9y3HHS78Co4cGv3sel-2k&source=gbs_api",
    language: "en",
    isFromAPI: true,
    rating: { totalRating: 0, count: 0 },
  },
];

const DATA_BOOKS_INFO_AH: MyInfoBookFormType[] = [
  // Son odeur après la pluie
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2023,
    month: 5,
    userNote: 5,

    userComments: "AH Odeur LU !!!",
  },
  // Aliénor T1
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2024,
    userComments: "AH Aliénor T1 LU !!!",
  },
  // Aliénor T2
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2025,
    userComments: "AH Aliénor T2 LU !!!",
  },
  // The Chocolate Touch
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2023,
    month: 3,
    userComments: "AH Chocolate Touch LU !!!",
  },
];

const DATA_BOOKS_INFO_AAA: MyInfoBookFormType[] = [
  // Son odeur après la pluie
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2023,
    month: 5,
    userNote: 4,
    userComments: "AAA Odeur LU !!!",
  },
  // Aliénor T1
  {
    bookStatus: BookStatusEnum.booksInProgressList,
    userComments: "AAA Aliénor T1 EN COURS !!!",
  },
  // Aliénor T2
  {
    bookStatus: BookStatusEnum.booksToReadList,
    //year: 2025,
    userComments: "AAA Aliénor T2 à lire !!!",
  },
  // The Chocolate Touch
  //   {
  //     bookStatus: BookStatusEnum.booksToReadList,
  //     //year: 2023,
  //     //month: 3,
  //     userComments: "AAA Chocolate Touch à lire !!!",
  //   },
];

const AdminPage = (): JSX.Element => {
  const { currentUser } = useUserStore();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  //   console.log("isAdmin", isAdmin);
  //   console.log("currentUser", currentUser?.uid);

  useEffect(() => {
    getDocsByQueryFirebase<UserType>("users", "id", currentUser?.uid)
      .then((docs) => {
        if (docs.length > 0) {
          setIsAdmin(docs[0].isAdmin);
        }
      })
      .catch((error) => {
        console.error("getDocsByQueryFirebase error:", error.message);
      });
  }, [currentUser]);

  // !! Avec le .then ne fonctionne pas ! (les livres s'ajoute mais les info user n'ajoute qu'un livre !)
  const addBooksAndUsersInfos = async (
    userId: string | undefined,
    dataBooksInfo: MyInfoBookFormType[]
  ) => {
    for (let index = 0; index < DATA_BOOKS.length; index++) {
      await addBookFirebase(userId, DATA_BOOKS[index], dataBooksInfo[index]);
      console.log(`UserAH : livre ${index} OK !!!`);
    }
    console.log("All books and user info added for AH");
  };

  return (
    <div className="min-h-screen max-w-3xl m-auto">
      <Title>Admin Page</Title>
      <Title level={2}>AJOUT</Title>

      <ol className="flex flex-col gap-4 m-2">
        <li>Créer compte AAA</li>
        <li>Créer compte AH</li>
        <li>AJOUTER l'id de AAA dans fonction addBooksAndUsersInfos</li>
        <li>Mettre AH en ADMIN</li>
        <li>Clic sur BOUTON Ajouter livres + infos user AH</li>
        <li>Clic sur BOUTON Ajouter livres + infos user AAA</li>
      </ol>
      {isAdmin ? (
        <div className="flex flex-col gap-4">
          {/* <Button className="bg-secondary/60" onClick={addUsers}>
            Ajouter Users
          </Button> */}
          <Button
            className="bg-primary/80"
            onClick={() =>
              addBooksAndUsersInfos(currentUser?.uid, DATA_BOOKS_INFO_AH)
            }
          >
            Ajouter livres + infos user AH
          </Button>
          <Button
            className="bg-secondary/50 flex gap-6"
            ////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////
            /////////////////////   REMPLACER L'ID !!!    //////////////////////////////
            ////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////
            onClick={() =>
              addBooksAndUsersInfos(
                "RVpdJRqRuOYPQAIsyswmJ7aOV0p2", //////////// ID AAA ICI
                DATA_BOOKS_INFO_AAA
              )
            }
          >
            <span className="text-red-500 font-bold text-xl">
              REMPLACER L'ID !!!
            </span>
            Ajouter livres + infos user AAA
          </Button>
          <Button className="bg-red-900" onClick={deleteAllDatas}>
            Supprimer toutes les données
          </Button>
          <Title level={2}>SUPPRESSION</Title>
          <ol className="flex flex-col gap-4 m-2">
            <li>Clic sur BOUTON Supprimer toutes les données</li>
            <li>SUPPRIMER les utilisateurs enregistrés, à la main</li>
          </ol>
        </div>
      ) : (
        <FeedbackMessage
          type="error"
          message="Vous n'êtes pas autorisé à accéder à cette page, vous devez être Admin."
        />
      )}
    </div>
  );
};

export default AdminPage;
