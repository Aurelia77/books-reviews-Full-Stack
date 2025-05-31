import FeedbackMessage from "@/components/FeedbackMessage";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import {
  addBookFirebase,
  deleteAllDatas,
  getDocsByQueryFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { EMPTY_BOOK } from "@/lib/constants";
import {
  BookStatusEnum,
  BookType,
  MyInfoBookFormType,
  UserType,
} from "@/lib/types";
import { useEffect, useState } from "react";

const DATA_BOOKS: BookType[] = [
  {
    ...EMPTY_BOOK,
    id: "fW2xEAAAQBAJ",
    title: "Son odeur après la pluie",
    authors: ["Cédric Sapin-Defour"],
    description:
      "C’est une histoire d’amour, de vie et de mort. Sur quel autre trépied la littérature danse-t-elle depuis des siècles ? Dans Son odeur après la pluie, ce trépied, de surcroît, est instable car il unit deux êtres n’appartenant pas à la même espèce : un homme et son chien. Un bouvier bernois qui, en même temps qu’il grandit, prend, dans tous les sens du terme, une place toujours plus essentielle dans la vie du narrateur.Ubac, c’est son nom (la recherche du juste nom est à elle seule une aventure), n’est pas le personnage central de ce livre, Cédric Sapin-Defour, son maître, encore moins. D’ailleurs, il ne veut pas qu’on le considère comme un maître. Le héros, c’est leur lien. Ce lien unique, évident et, pour qui l’a exploré, surpassant tellement d’autres relations. Ce lien illisible et inutile pour ceux à qui la compagnie des chiens n’évoque rien. Au gré de treize années de vie commune, le lecteur est invité à tanguer entre la conviction des uns et l’incompréhension voire la répulsion des autres ; mais nul besoin d’être un homme à chiens pour être pris par cette histoire car si pareil échange est inimitable, il est tout autant universel. Certaines pages, Ubac pue le chien, les suivantes, on oublie qu’il en est un et l’on observe ces deux êtres s’aimant tout simplement.C’est bien d’amour dont il est question. Un amour incertain, sans réponse mais qui, se passant de mots, nous tient en haleine. C’est bien de vie dont il est question. Une vie intense, inquiète et rieuse où tout va plus vite et qu’il s’agit de retenir. C’est bien de mort dont il est question. Cette chose dont on ne voudrait pas mais qui donne à l’existence toute sa substance. Et ce fichu manque. Ces griffes que l’on croit entendre sur le plancher et cette odeur, malgré la pluie, à jamais disparue.",
    categories: ["Fiction / Literary", "Fiction / General"],
    imageLink:
      "http://books.google.com/books/publisher/content?id=fW2xEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71VtGnh_FhexoU5kkTndBNcIGq-YlbG2ZrE9CexvpV_Fin9qeAclOih3POPc1K1yTkl_QneMf1iSJFXiFfrzAxVfkVtMPdzFHq6_TcdIjqa0PTfdOcRC1fsXmy0FYlDesqU5KDZ&source=gbs_api",
    language: "fr",
    isFromAPI: true,
  },
  {
    ...EMPTY_BOOK,
    id: "lA7MDwAAQBAJ",
    title: "Aliénor d'Aquitaine, T1 : L'Été d'une reine",
    authors: ["Elizabeth Chadwick", "Alain Sainte-Marie", "Anne-Claire Payet"],
    description:
      "<p>« Votre père souhaitait pour vous un mariage qui fît honneur à votre personne et à l'Aquitaine, tout en vous hissant jusqu'aux plus hautes dignités. Il désirait également la sécurité et la paix pour vous-même et vos terres. Avant de partir, il a demandé au roi de France d'assurer votre sauvegarde. Dans ce but, il a arrangé un mariage entre vous et Louis, son héritier. Un jour, vous serez reine de France et, si Dieu le veut, à l'origine d'une dynastie de souverains dont le royaume s'étendra de Paris aux Pyrénées. »</p><p></p><p>Jeune, belle et vive d'esprit, Aliénor est promise à un somptueux avenir en tant que future duchesse d'Aquitaine. Mais lorsque son père meurt subitement lors de l'été 1137, elle rentre du jour au lendemain dans l'âge adulte. Contrainte d'épouser le jeune prince Louis de France, Aliénor peine à s'accoutumer à son nouveau rôle tandis qu'ils accèdent tous deux au trône de France. Aliénor devra désormais renoncer à la vie qu'elle a menée jusque-là pour affronter les intrigues de la Cour.</p><p></p><p>Figure emblématique de l'histoire de France et de l'Angleterre, Aliénor d'Aquitaine fascine depuis plus de huit cents ans. S'appuyant sur les toutes dernières découvertes des historiens, Elizabeth Chadwick redonne vie à ce personnage d'exception comme jamais auparavant.</p><p></p><p>« Elizabeth Chadwick fait partie de ces auteurs qui savent comment rendre l'Histoire vivante. » The Times</p><p></p><p>« Ouvrir un livre d'Elizabeth Chadwick, c'est s'embarquer pour un fabuleux voyage. Cette autrice sait camper comme personne des personnages convaincants et les faire évoluer avec maestria à travers le temps et l'espace. » Daily Telegraph</p><p></p><p>« La réputation d'Elizabeth Chadwick n'est plus à faire. Avec ce nouveau roman historique, elle nous révèle les arcanes des luttes de pouvoir et de la guerre des sexes à travers les yeux de cette femme remarquable que fut Aliénor d'Aquitaine. » New York Post</p><p></p><p>« Elizabeth Chadwick s'impose comme la meilleure autrice de romans médiévaux de ces dix dernières années. » Historical Novels Revie</p><p></p><p>« Un roman historique très bien documenté qui n'oublie pas d'être divertissant et sensuel. » Daily Mail</p>",
    categories: [
      "Fiction / Historical / General",
      "Fiction / Historical / Medieval",
    ],
    imageLink:
      "http://books.google.com/books/publisher/content?id=lA7MDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73cdkZnHKh7h01kIc8R-8_nNlXZezx7eruyEZ3VgGeIchWHI6xpnIdfoHS76l_6_INePJ8F4YMIybjXjekkkRLY_VhozTxThA3LmERat_eHQsH_GmtpTJkSxsEapfqx-LUWKvbB&source=gbs_api",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "ZwboDwAAQBAJ",
    title: "Aliénor d'Aquitaine, T2 : L'Automne d'une reine",
    authors: ["Elizabeth Chadwick", "Alain Sainte-Marie", "Anne-Claire Payet"],
    description:
      "<p>« La meilleure autrice de romans médiévaux de ces dix dernières années. » Historical Novels Review</p><p></p><p>Derrière la reine légendaire se cache une femme d'exception.</p><p>1154. Aliénor est couronnée reine d'Angleterre aux côtés de son époux, le jeune Henri II Plantagenêt. Elle est désormais l'une des femmes les plus puissantes d'Europe. Tandis que Henri part en guerre contre les ennemis de la Couronne afin d'asseoir son autorité, Aliénor se révèle une souveraine active sur tous les fronts et une mère dévouée pour leurs nombreux enfants. Mais bientôt délaissée par Henri, qui lui préfère sa jeune amante, Aliénor se voit peu à peu déposséder du pouvoir qui est sien. Alors que la rébellion couve au sein de la famille royale, Aliénor découvre à ses dépens que même une reine doit constamment se battre pour conserver sa place.</p><p></p><p>Figure emblématique de l'histoire de France et de l'Angleterre, Aliénor d'Aquitaine fascine depuis plus de huit cents ans. S'appuyant sur les toutes dernières découvertes des historiens, Elizabeth Chadwick redonne vie, comme jamais auparavant, à ce personnage d'exception.</p><p></p><p>« Ouvrir un livre d'Elizabeth Chadwick, c'est s'embarquer pour un fabuleux voyage. Cette autrice sait camper comme personne des personnages convaincants et les faire évoluer avec maestria à travers le temps et l'espace. » Daily Telegraph</p><p>« Elizabeth Chadwick allie souci du détail historique et tension dramatique en un roman d'une grande fraîcheur riche en émotions. » Mail on Sunday</p><p>« Un pur plaisir de lecture ! » Daily Mail</p><p>« Une grande exactitude historique au service d'un récit puissant. » Woman & Home</p><p>« Des personnages au caractère bien trempé qui nous entraînent au travers des vicissitudes de l'Histoire. » Daily Telegraph</p>",
    categories: ["Fiction / Literary", "Fiction / General"],
    imageLink:
      "http://books.google.com/books/publisher/content?id=ZwboDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71O5174y3AEytNlk-k6dVxFpFz-YcbsjLQJPwBFfxVZ3-1-FpDPdxb7Vc89upeO9mbpgp3ekmAH5V81yoSXeTB0pthA_G-HoWiMFlafQ_Q8pFtM7DEVf8xctRPjRD7_FIlvB_i8&source=gbs_api",
    language: "fr",
    rating: { totalRating: 0, count: 0 },
  },
  {
    ...EMPTY_BOOK,
    id: "NsgKEAAAQBAJ",
    title: "Aliénor d'Aquitaine, T3 : L'Hiver d'une reine",
    authors: ["Elizabeth Chadwick", "Alain Sainte-Marie", "Anne-Claire Payet"],
    description:
      "<p>Une reine, une mère, une légende...</p><p>Emprisonnée par son mari Henri II Plantagenêt et séparée de ses enfants, Aliénor ne s'avoue pas vaincue et refuse de se soumettre à la tyrannie. Après la mort du roi elle devient reine douairière d'Angleterre et s'efforce de tempérer ses fils désormais rivaux dans la conquête du pouvoir. Infatigable, elle traverse les Alpes, réunit la rançon pour faire libérer son fils Richard Coeur de Lion et déjoue les manoeuvres de son autre fils, Jean sans Terre. Jusqu'à son dernier souffle son courage et sa ténacité seront soumis à rude épreuve par d'incessantes luttes intérieures et la nécessité de forger de nouvelles alliances pour conserver le trône.</p><p></p><p>Avec L'Hiver d'une reine, Elizabeth Chadwick apporte une conclusion exaltante à sa trilogie magistrale consacrée à Aliénor d'Aquitaine. Figure emblématique de l'histoire de France et d'Angleterre, Aliénor d'Aquitaine fascine depuis plus de huit cents ans. S'appuyant sur les toutes dernières découvertes des historiens, Elizabeth Chadwick redonne vie, comme jamais auparavant, à ce personnage d'exception.</p><p></p>",
    categories: ["Fiction / Literary", "Fiction / General"],
    imageLink:
      "http://books.google.com/books/publisher/content?id=NsgKEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE724Vn54QOvj3Q4kW8UvZKY9qVhLIiQN8F0owlaxC1l8ZXVuzO-ZzXmpk5WjoM2QMFrS-QieMzedQt5hE4RdJ41SuTN5xmDLvb6EDRhZCHoGtErAiK8_uWhvO76Ngq3ta64qeCd1&source=gbs_api",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
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
    imageLink:
      "http://books.google.com/books/content?id=OGahkZCah7sC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE7131C0PclFewOhkppUkpAuVYmWgKqq5YieYPc-CH4MIJN_tnvt0dD5zQ0DK6I89UI7xhSHrV4arCHUlT-agJsFR_N3nNSfFU4wiKXYUI4_pdPs_JLh9y3HHS78Co4cGv3sel-2k&source=gbs_api",
    language: "en",
  },
  {
    ...EMPTY_BOOK,
    id: "MC74zwEACAAJ",
    title: "Plus on est de fous...",
    authors: ["Zoé Brisby"],
    description: "",
    categories: [],
    imageLink: "",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "BoGjEAAAQBAJ",
    title: "Les pouvoirs insoupçonnés de l'intuition",
    authors: ["Saverio Tomasella"],
    description:
      "Qu’est-ce qui nous aide véritablement à guérir ? Comment apaiser durablement nos corps et nos esprits ? Comment retrouver notre vitalité profonde ?<br><br>Véritable voyage aux frontières de la conscience, cet ouvrage enquête sur les pouvoirs de l’intuition comme levier de guérison.<br><br>Au fur et à mesure de son investigation, l’auteur mêle habilement preuves scientifi ques et témoignages. Il y découvre que l’intuition, plus qu’une simple boussole pour s’orienter dans la vie, est un puissant outil thérapeutique.<br><br>Médiation, exercices de visualisation, rêves éveillés, chamanisme, transe... à l’aide de nombreuses techniques destinées à élargir la conscience, apprenez à écouter les messages que vous envoie votre corps, reconnectez-vous à votre énergie vitale et réveillez vos facultés d’autoguérison.",
    categories: ["Literary Criticism / General"],
    imageLink:
      "http://books.google.com/books/publisher/content?id=BoGjEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE730DLreen8YsGkjf2YYzf8TzCj9Q2i42HQFBm8VWl5rur6ruX4bOpNU2BRagwQPTpwI5k94pZCtuQd4QH-zTgIN5-QlNagDA8CQNW-ZWZCHlOy8YrZu0tjU_lgfTqTY4zd8ZcvZ&source=gbs_api",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "SeMazgEACAAJ",
    title: "The Happy Prince by Oscar Wilde",
    authors: ["Oscar Wilde"],
    description: `<p><br></p><p>The Happy Prince and Other Tales (sometimes called The Happy Prince and Other Stories) is a collection of stories for children by Oscar Wilde first published in May 1888. It contains five stories: "The Happy Prince", "The Nightingale and the Rose", "The Selfish Giant", "The Devoted Friend", and "The Remarkable Rocket".</p><p>In a town full of suffering poor people, a swallow who was left behind after his flock flew off to Egypt for the winter meets the statue of the late "Happy Prince", who in reality has never experienced true sorrow, for he lived in a palace where sorrow was not allowed to enter.Viewing various scenes of people suffering in poverty from his tall monument, the Happy Prince asks the swallow to take the ruby from his hilt, the sapphires from his eyes, and the gold leaf covering his body to give to the poor. </p><p>As the winter comes and the Happy Prince is stripped of all of his beauty, his lead heart breaks when the swallow dies as a result of his selfless deeds and severe cold.The people, unaware of their good deeds, take the statue down from the pillar due to its shabbiness (intending to replace it with one of the Mayor, ) and the metal melted in a furnace, leaving behind the broken heart and the dead swallow; they are thrown in a dust heap.These are taken up to heaven by an angel that has deemed them the two most precious things in the city. This is affirmed by God, and they live forever in his "city of gold" and garden of paradise.</p><p><br></p>`,
    categories: [
      "Fiction / Classics",
      "Fiction / Short Stories (single author)",
    ],
    imageLink:
      "http://books.google.com/books/content?id=SeMazgEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72U4JYVLf3jWRh3r94VkJC_ISfsgO7oqsup2J9cg2W5fdKMCRg4k-wyQRxmON5mrPp0n4P9F0tSQjR00mF_dZBa7NGxjGfANjrO4VWVgX-Kv_ATCeLw8e5pFH9H_4nq1cBkW_h8&source=gbs_api",
    language: "en",
  },
  {
    ...EMPTY_BOOK,
    id: "3v_GtgEACAAJ",
    title: "L'homme qui rit",
    authors: ["Victor Hugo"],
    description:
      "The Man Who Laughs (also published under the title By Order of the King) is a novel by Victor Hugo, originally published in April 1869 under the French title L'Homme qui rit. It was adapted into a popular 1928 film, directed by Paul Leni and starring Conrad Veidt, Mary Philbin and Olga Baclanova. It was recently adapted for the 2012 French film L'Homme Qui Rit, directed by Jean-Pierre Améris and starring Gérard Depardieu, Marc-André Grondin and Christa Theret. In 2016, it was adapted as The Grinning Man, an English musical. In 2018, The Man Who Laughs is set to be adapted into a South Korean musical of the same name starring EXO's Suho and Park Hyo-shin. We are delighted to publish this classic book as part of our extensive Classic Library collection. Many of the books in our collection have been out of print for decades, and therefore have not been accessible to the general public. The aim of our publishing program is to facilitate rapid access to this vast reservoir of literature, and our view is that this is a significant literary work, which deserves to be brought back into print after many decades. The contents of the vast majority of titles in the Classic Library have been scanned from the original works. To ensure a high quality product, each title has been meticulously hand curated by our staff. Our philosophy has been guided by a desire to provide the reader with a book that is as close as possible to ownership of the original work. We hope that you will enjoy this wonderful classic work, and that for you it becomes an enriching experience.",
    categories: ["Literary Collections / European / French"],
    imageLink:
      "http://books.google.com/books/content?id=3v_GtgEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE7266wT1RZwpzIcO4U8_qm32QMF4GSdiEYzyLuFmtoZELKMcAughR0r4TIY7qTLtVANQNyx63iDLc3sgRRF2q_R_Qr1caV7UhVGDQGAmVCtHI-tWWMDz4xtPCXgHBDrnSrilvy-q&source=gbs_api",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "UmhZDwAAQBAJ",
    title: "Les Hauts de Hurle-vent",
    authors: ["Emily Brontë"],
    description: `<p><b>À l'occasion du bicentenaire de la naissance d'Emily Brontë, " Pavillons Poche " publie son chef-d'oeuvre et unique roman, <i>Les Hauts de Hurle-Vent</i>, avec une préface de Lydie Salvayre.</b><br> " Il est l'orgueil en personne. Il est l'excès. Il est la foudre. Il est élégant et sauvage. Il est tendre et brutal comme un tranchant de scie. Il s'appelle Heathcliff. De Heathcliff, Emily Brontë a le caractère entier, l'insolence prompte et le refus têtu de se plier aux contraintes sociales dès lors qu'elles ne s'appuient que sur des faux-semblants. De lui, le goût de la lande que, depuis l'enfance, elle parcourt en tous sens, une lande qui meurt l'hiver sous le poids de la neige et les hurlements du vent pour renaître au printemps dans les bruyères roses et les crocus dorés dont elle fait des bouquets. Mais Emily ne partage en rien la noirceur effroyable de son héros, pas plus que sa classe sociale dite inférieure, une classe contre laquelle Heathcliff, l'enfant trouvé, l'enfant sauvage, l'enfant sans nom et sans lignage, se révoltera et se vengera avec un acharnement qui confinera à la démence. " Lydie Salvayre<br><br></p>`,
    categories: ["Fiction / Classics", "Fiction / General"],
    imageLink: "",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "RsrADwAAQBAJ",
    title: "Le Grand voyage de la Marie-Amélie",
    authors: ["Olivier Cojan"],
    description:
      "<p> <i>Novembre 1741, sur les quais de Nantes. </i> </p> <p> <i>- Simon Levrault, chirurgien ? Il lut jusqu’au bout, sans se presser, le document que je venais de lui remettre de la part des négociants armateurs Trottignon & Lecourbe : c’était le contrat de mon engagement comme chirurgien sur la Marie-Amélie. </i> </p> <p> <i>- Qu’est-ce que vous connaissez aux nègres ?</i> </p> <p> <i> - Je n’en ai pas encore examiné, je n’en ai même jamais vu ! Mais j’ai appris à palper les corps, j’ai étudié l’anatomie et la pharmacopée classique. J’ai exercé comme chirurgien ambulant. Je suis capable de soigner des nègres, dans la mesure du possible évidemment.</i> </p> <p> </p> <p>À la fois implacable et bouleversant ce nouveau roman d’Olivier Cojan nous entraîne sur les routes du commerce triangulaire au XVIIIe siècle. À travers le récit mélancolique de Simon Levrault, l’auteur poursuit sa quête d’humanité et s’interroge sur les liens intimes que nous entretenons tous avec la lâcheté et, parfois, avec l’audace et le courage.</p>",
    categories: ["Fiction / Literary"],
    imageLink:
      "http://books.google.com/books/publisher/content?id=RsrADwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73ZaQ7Q-DmuwojvtRo7Fyy8f2iZYHOAhCd34bu7dleyW0llij72xiKpVmwxa8tqPTV1-H4U5g8ZGlc6J8A_i8f6Mvx8IFpuJl_Hs6QYRRiEeACkKCeimGtjIO1aLXcckqk3sNDU&source=gbs_api",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "cbkQIZy-gUEC",
    title: "Desert",
    authors: ["J.M.G Le Clézio"],
    description:
      "<p> <b>The international bestseller, by the winner of the Nobel Prize for Literature 2008, available for the first time in English translation.</b> <br> <br> Young Nour is a North African desert tribesman. It is 1909, and as the First World War looms Nour's tribe - the Blue Men - are forced from their lands by French colonial invaders. Spurred on by thirst, hunger, suffering, they seek guidance from a great spiritual leader. The holy man sends them even further from home, on an epic journey northward, in the hope of finding a land in which they can again be free. <br> <br> Decades later, an orphaned descendant of the Blue Men - a girl called Lalla - is living in a shantytown on the coast of Morocco. Lalla has inherited both the pride and the resilience of her tribe - and she will need them, as she makes a bid to escape her forced marriage to a wealthy older man. She flees to Marseilles, where she experiences both the hardships of immigrant life - as a hotel maid - and the material prosperity of those who succeed - when she becomes a successful model. And yet Lalla does not betray the legacy of her ancestors. <br> <br> In these two narratives set in counterpoint, Nobel Prize-winning novelist J. M. G. Le Clézio tells - powerfully and movingly - the story of the 'last free men' and of Europe's colonial legacy - a story of war and exile and of the endurance of the human spirit.</p>",
    categories: ["Fiction / General", "Fiction / Historical / General"],
    imageLink:
      "http://books.google.com/books/content?id=cbkQIZy-gUEC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71whgIzgn59U4oc4Ihkm5bQFequlwl4gMg3v9uHz9kss89f2zBCaelGRzKdFqfOb1CuMRgXbM42-bJQSEl3x_-MLRkGdAnq3is2C03Ol5MNmpagrwEXCSHYLlWx3Kw6voI0qZOx&source=gbs_api",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "e5jxDwAAQBAJ",
    title: "Le Silence de la ville blanche",
    authors: ["Eva Garcia Saenz de Urturi"],
    description:
      "<p>Quand le passé vient à nouveau hanter une ville... <br>Dans la cathédrale de Sainte-Marie à Vitoria, un homme et une femme d'une vingtaine d'années sont retrouvés assassinés, dans une scénographie macabre : ils sont nus et se tiennent la main comme des amoureux alors que les deux victimes ne se connaissaient pas. <br>Détail encore plus terrifiant : l'autopsie montrera que leur mort a été provoquée par des abeilles mises dans leur bouche. L'ensemble laisse croire qu'il existe un lien avec une série de crimes qui terrorisaient la ville vingt ans auparavant. Sauf que l'auteur de ces actes, jadis membre apprécié de la communauté de Vitoria, est toujours derrière les barreaux. Alors que sa libération conditionnelle est imminente, qui est le responsable de ces nouveaux meurtres et quel est vraiment son but ? <br>Une certitude, l'inspecteur Unai López de Ayala, surnommé Kraken, va découvrir un tout autre visage de la ville. <br></p>",
    categories: ["Fiction / Thrillers / General", "Fiction / Crime"],
    imageLink:
      "http://books.google.com/books/publisher/content?id=e5jxDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE735Mk5pb3JzUArqIPHOihhfPzEAGiMNpoZzURh-bnltQ3GG__0TIz-HYSMC2-asWyEHwiijrYkDMJjMegHmdugpeH8i40l-NMciWJBoFwrJKcU2cyf_4AZMSJJb6INnUiWZpjZc&source=gbs_api",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "C6h-EAAAQBAJ",
    title: "Vieille fille - Une proposition",
    authors: ["Marie Koc"],
    description: `<p>On la dit laide, revêche, frigide, avare, aigrie, ennuyeuse et ennuyée. On l'imagine avec ses chats, ses pelotes de laine et sa solitude. Parce qu'elle n'a pas eu la chance de trouver un mari ou de faire des enfants, la vieille fille représente un échec. Elle est celle qui n'a pas joué ou qui a perdu au jeu de l'amour. Elle est ce que l'on ne souhaite pas aux jeunes filles de devenir, une image épouvantail. <br>Pourtant, la vieille fille a-t-elle vraiment un destin aussi peu enviable ? Lui a-t-on d'ailleurs demandé son avis ? Et si la vieille fille ne racontait finalement pas tant sa propre condition qu'elle ne tendait un miroir à celles qui ont eu la chance de ne pas connaître ce sort honteux ? Si elle était plutôt celle qui échappe aux carcans, à la surveillance, aux loyautés et aux alliances impossibles à défaire, à l'espace et au temps constamment partagés ? <br>Journaliste, Marie Kock est aussi ce qu'on appelle une " vieille fille ". Mêlant récit personnel, pop culture et études sociologiques, Vieille fille formule une hypothèse : qu'il est possible d'inventer d'autres manières de vivre, pour soi et avec les autres, de trouver l'amour ailleurs, autrement. D'avoir, simplement, envie d'autre chose.</p>`,
    categories: ["Social Science / Essays", "Political Science / General"],
    imageLink:
      "http://books.google.com/books/publisher/content?id=C6h-EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70ogf1vL7qhx2SzknUtN1ZCpqE3GKsJOxwIb3IVx-79JOfVTjkPYG6mgU8pxfCmwF9__-SBsCwefwc7EQRDZgX6QSJ0UScPUgWFkI3wK3u4xitqXLc8xxZsXvB0diO0v--1aGCA&source=gbs_api",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "JnDDDwAAQBAJ",
    title: "La Porte des mondes",
    authors: ["Robert Silverberg"],
    description:
      "<p>En 1348, totalement ravagée par la peste, l’Europe a été conquise par l’Empire ottoman qui y règne en maître absolu. <br>La Renaissance et les Grandes Découvertes n’ont pas eu lieu. <br>Et les Aztèques dominent le Nouveau Monde.</p> <p>Dans les années 1960, Dan Beauchamps, jeune Anglais fougueux en quête de gloire et de reconnaissance, quitte l'Angleterre pour les Hespérides. <br>Il s’embarque alors pour une extraordinaire aventure autour d’une planète devenue le miroir inversé de l’ordre mondial actuel.</p> <p><b>Robert Silverberg</b>, l’un des maîtres contemporains de la science-fiction, s’empare avec délectation des pouvoirs de l’uchronie, et nous propose un véritable bolide littéraire à dévorer d’une traite, haletant et riche en action.</p>",
    categories: ["Fiction / Science Fiction / General"],
    imageLink:
      "http://books.google.com/books/publisher/content?id=JnDDDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71ulrLCNhDD21ivX5edy4LAB4wm3e54DSo1u09cOuUECFIfTElNbsu2wiJIB7umHkD61mRZsZ-oqVoibeYn08RlplxEfmaKxWjZwdWmK6dApAnGrB9Kqzd_qUfuhfVHEFMvIPmG&source=gbs_api",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "_lyPEAAAQBAJ",
    title: "Wild (Movie Tie-in Edition)",
    authors: ["Cheryl Strayed"],
    description:
      "<p><b>#1 <i>NEW YORK TIMES</i> BESTSELLER • <b><b>A powerful, blazingly honest memoir: the story of an eleven-hundred-mile solo hike that broke down a young woman reeling from catastrophe—and built her back up again.</b></b><br><br></b>At twenty-two, Cheryl Strayed thought she had lost everything. In the wake of her mother’s death, her family scattered and her own marriage was soon destroyed. Four years later, with nothing more to lose, she made the most impulsive decision of her life. With no experience or training, driven only by blind will, she would hike more than a thousand miles of the Pacific Crest Trail from the Mojave Desert through California and Oregon to Washington State—and she would do it alone.<br><br>Told with suspense and style, sparkling with warmth and humor, <i>Wild</i> powerfully captures the terrors and pleasures of one young woman forging ahead against all odds on a journey that maddened, strengthened, and ultimately healed her.<br><br><br><br></p>",
    categories: [
      "Biography & Autobiography / Personal Memoirs",
      "Travel / Special Interest / Adventure",
      "Travel / United States / West / Pacific (AK, CA, HI, OR, WA)",
    ],
    imageLink:
      "http://books.google.com/books/publisher/content?id=_lyPEAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73HDIba6VUWHiYuqQE1iAeEj-3jo8bTpK6cLxD_xguW6PzVdOErzI-YLv70tYxh6cfMTT8ZunorDBEn59lUY3saqPrzRD2OWMhgLsf4Aw-GYE7sjzZO5xcr9EnBU5CeiVxwv49-&source=gbs_api",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "eek9AwAAQBAJ",
    title: "Les Chaussures italiennes",
    authors: ["Henning Mankell"],
    description:
      "<p>A soixante-six ans, Fredrik Welin vit reclus depuis une décennie sur une île de la Baltique avec pour seule compagnie un chat et un chien et pour seules visites celles du facteur de l'archipel. Depuis qu'une tragique erreur a brisé sa carrière de chirurgien, il s'est isolé des hommes. Pour se prouver qu'il est encore en vie, il creuse un trou dans la glace et s'y immerge chaque matin. Au solstice d'hiver, cette routine est interrompue par l'intrusion d'Harriet, la femme qu'il a aimée et abandonnée quarante ans plus tôt. Fredrik ne le sait pas encore, mais sa vie vient juste de recommencer.<br><br> Le temps de deux solstices d'hiver et d'un superbe solstice d'été, dans un espace compris entre une maison, une île, une forêt, une caravane, Mankell nous révèle une facette peu connue de son talent avec ce récit sobre, intime, vibrant, sur les hommes et les femmes, la solitude et la peur, l'amour et la rédemption.<br><br><br> Né en 1948, <b>Henning Mankell </b>partage sa vie entre la Suède et le Mozambique. Lauréat de nombreux prix littéraires, célèbre pour ses romans policiers centrés autour de l'inspecteur Wallander, il est aussi l'auteur de romans ayant trait à l'Afrique ou à des questions de société, de pièces de théâtre et d'ouvrages pour la jeunesse.<br><br><br> Bio traductrice pour rabat jaquette 337 signes<br><br> D'origine suédoise, née à Lisbonne, élevée au Portugal puis en Belgique, <b>Anna Gibson</b> est arrivée en France en 1981 à l'âge de dix-huit ans. Elle est traductrice littéraire à plein temps depuis 1989 (Henning Mankell, Colm Tóibín, Monika Fagerholm, Klas Östergren...). Elle est aussi l'auteur d'un roman, <i>Cet été</i>, paru chez Balland en 1997.<br><br></p>",
    categories: [
      "Literary Collections / European / Scandinavian",
      "Fiction / General",
    ],
    imageLink:
      "http://books.google.com/books/publisher/content?id=eek9AwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73ht2MSExKXgZ6NZUP1a3r7-Xop7Ua0BKTavnMNdE5ZgSculmd9hjSzKQFJ0NlzHL7ehLyEruHbcC0YLBi0E6mt8VSXyvzPoEN15QEPLgPmwmhR-aKUdq_8GpHoqF5rLcF5UtE_&source=gbs_api",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "pycSEAAAQBAJ",
    title: "La rencontre, une philosophie",
    authors: ["Charles Pépin"],
    description: `<p>Dans la lignée de <i>Les Vertus de l'échec </i>et <i>La Confiance en soi, </i>un nouvel essai de philosophie pratique, où Charles Pépin montre que toute vraie rencontre est en même temps une découverte de soi et une redécouverte du monde. <br> Une philosophie salutaire en ces temps de repli sur soi. <br>Pourquoi certaines rencontres nous donnent-elles l'impression de renaître ? Comment se rendre disponibles à celles qui vont intensifier nos vies, nous révéler à nous-mêmes ? <br><br> La rencontre – amoureuse, amicale, professionnelle – n'est pas un " plus " dans nos vies. Au cœur de notre existence, dont l'étymologie latine <i>ex-sistere</i> signifie " sortir de soi ", il y a ce mouvement vers l'extérieur, ce besoin d'aller vers les autres. Cette aventure de la rencontre n'est pas sans risque, mais elle a le goût de la " vraie vie ". <br><br> De Platon à Christian Bobin en passant par <i>Belle du Seigneur </i>d'Albert Cohen ou <i>Sur la route de Madison </i>de Clint Eastwood, Charles Pépin convoque philosophes, romanciers et cinéastes pour nous révéler la puissance, la grâce de la rencontre. En analysant quelques amours ou amitiés fertiles – Picasso et Éluard, David Bowie et Lou Reed, Voltaire et Émilie du Châtelet... – il montre que toute vraie rencontre est en même temps une découverte de soi et une redécouverte du monde. <br><br> Une philosophie salutaire en ces temps de repli sur soi.</p>`,
    categories: ["Philosophy / Essays", "Philosophy / General"],
    imageLink:
      "http://books.google.com/books/publisher/content?id=pycSEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73BKc33uG40POYKNpZ50Uf2wdIAa1lafhcoUsTKg2_ruGhH1Q5IvxShCRskxe-HVLzgZL3JSdRBWJPco6-qTnkgCkne9DiizQU13tJiELVyIdPfKXT7ilF7vt7pDXkFZWzYq9yx&source=gbs_api",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "yVeaoAEACAAJ",
    title: "Immortelle randonnée",
    authors: ["Jean-Christophe Rufin"],
    description: `«Chaque fois que l'on m'a posé la question "Pourquoi êtes-vous allé à Santiago?", j'ai été bien en peine de répondre. Car le Chemin a pour effet sinon pour vertu de faire oublier les raisons qui ont amené à s'y engager. On est parti, voilà tout.» Jean-Christophe Rufin a suivi le «Chemin du Nord» jusqu'à Saint-Jacques : huit cents kilomètres le long des côtes basque et cantabrique, à travers les montagnes sauvages des Asturies et de Galice. Il s'est peu à peu transformé en clochard céleste, en routard de Compostelle. Il nous raconte, avec une délicieuse autodérision, ce parcours humain et spirituel. -- 4ème de couverture.`,
    categories: [],
    imageLink:
      "http://books.google.com/books/content?id=yVeaoAEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72XZjgIpN3KZyISlRT0tiXNYykLUKzTF8z18CfhhbZjXZepUJdnImp_t-S7ed8kEivzGgk8vAIos9MqwBYy8mgBDNbFaYeLiAqA9oPyB1e1HJdTWknXZ3cFBScLLGPrpTx5djR6&source=gbs_api",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "4bGODwAAQBAJ",
    title: "Donne-moi des ailes",
    authors: ["Nicolas Vanier"],
    description:
      "<p> Et soudain les hommes et les oiseaux n’ont fait qu’un…</p><p>Ces oies naines menacées de disparition, qui, chaque matin, survolent étangs et marais, Christian a décidé de les sauver. Il en a fait son combat. fatigué par la ville et son rythme infernal, il a tout quitté pour s’installer dans un mas de Camargue, en pleine nature, au milieu des oiseaux.</p><p>C’est là qu’il échafaude son plan, en secret, à la lisière de la légalité. Un projet fou : habituer des oisons, dès la couveuse, au bruit d’un ULM, pour, un jour, voler avec eux en escadrille sur une nouvelle route migratoire, à l’abri des dangers.</p><p>En poursuivant ce rêve immense, christian doit affronter l’hostilité de son fils, Thomas, dont le paysage se limite à son écran d’ordinateur. jusqu’au jour où l’adolescent rebelle se laisse émouvoir par ces oisons qui s’entichent de lui au point de le prendre pour leur père ou leur mère.</p><p>Pour Christian et son fils, c’est le retour d’une complicité perdue et le début du grand voyage, de la Scandinavie à la Camargue.<br>Mais l’un et l’autre sont loin d’imaginer les périls qui les attendent...</p><p>Inspiré d’une incroyable histoire vraie, celle de Christian Moullec, Donne-moi des ailes n’est pas seulement un grand roman d’aventures : c’est un cri d’alarme contre la disparition de millions d’oiseaux dans le monde.</p><p>Aventurier, écrivain, cinéaste, Nicolas Vanier a lui-même volé avec les oies. Après ce voyage bouleversant, il a décidé de porter cette histoire  à l’écran. Un film événement qui sortira en salles le 9 octobre 2019.</p>",
    categories: ["Fiction / Action & Adventure"],
    imageLink:
      "http://books.google.com/books/publisher/content?id=4bGODwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73HFvt9m6mu4tOepB4Al6NI9vT6Dr17__Nql2O9UY1HZTyRhAJ-j0vEV1sdNmFmyeB4e7LgN_XEJxFUo0FKNZEDLSw7EvpcG2IfACqndZxbQE5k56JXBWqj22LsMDEMdH4E8yg9&source=gbs_api",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "N9-1ngEACAAJ",
    title: "Le Hobbit",
    authors: ["John Ronald Reuel Tolkien"],
    description:
      "Premier récit publié par JRR Tolkien, en 1937, cette histoire, inventée par lᑪuteur pour ses propres enfants, rapporte les aventures de Bilbo, un jeune Hobbit, héros malgré lui lancé en quête d'ņun trésor gardé par un dragon, en compagnie de Nains et du magicien Gandalf. Bien que destiné initialement à la jeunesse, ce texte a également enchanté des générations de lecteurs adultes, par son suspense, ses coups de théâtre, son humour, sa poésieĳ mais aussi parce quņil introduit le lecteur dans un monde inventé par Tolkien, la Terre du Milieu, qui sert de décor à la plupart de ses récits (dont Le Seigneur des Anneaux) ; et parce quņil présente des personnages appelés à connaître une grande postérité, dont les Hobbits, Gandalf etĳ lņ'Anneau. Cette édition est servie par la nouvelle traduction, assurée par Daniel Lauzon, qui respecte les particularités du texte, son jeu avec les registres (du plus léger, au début du récit, vers des moments plus sombres, annonçant Le Seigneur des Anneaux qui prendra sa suite), la musicalité des chansons et des poèmes.",
    categories: ["", ""],
    imageLink: "",
    language: "fr",
  },
  {
    ...EMPTY_BOOK,
    id: "WmOFEAAAQBAJ",
    title: "Le Seigneur des Anneaux T1 La fraternité de l'anneau",
    authors: ["J.R.R. Tolkien"],
    description:
      "Dans un paisible village du Comté, le jeune Frodo est sur le point de recevoir un cadeau qui changera sa vie à jamais : l’Anneau de Pouvoir. Forgé par Sauron au cœur de la Montagne du Feu, on croyait l’Anneau perdu depuis qu’un homme l’avait arraché au Seigneur des Ténèbres avant de le chasser hors du monde. À présent, de noirs présages s’étendent à nouveau sur la Terre du Milieu, les créatures maléfiques se multiplient et, dans les Montagnes de Brume, les Orques traquent les Nains. L’ennemi veut récupérer son bien afin de dominer le monde ; l’Œil de Sauron est désormais pointé sur le Comté. Heureusement Gandalf les a devancés. S’ils font vite, Frodo et lui parviendront peut-être à détruire l’Anneau à temps. Chef-d’œuvre de la fantasy, découverte d’un monde imaginaire, de sa géographie, de son histoire et de ses langues, mais aussi réflexion sur le pouvoir et la mort, Le Seigneur des Anneaux est sans équivalent par sa puissance d’évocation, son souffle et son ampleur. Cette traduction de Daniel Lauzon prend en compte la dernière version du texte anglais, les indications laissées par Tolkien à l’intention des traducteurs et les découvertes permises par les publications posthumes proposées par Christopher Tolkien. Ce volume contient 18 illustrations d’Alan Lee, ainsi que deux cartes en couleur de la Terre du Milieu et du Comté.",
    categories: ["Fiction / General", "Fiction / Fantasy / General"],
    imageLink:
      "http://books.google.com/books/publisher/content?id=WmOFEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71Y8E0zgEfvbtU79o4puhhQz4-s9ZsUmEOFGAfsLvkCzHJ95t0blsv1TJ47bF4SM5rmi5O9c0QK_j9CMEl4-aDbj4ctyN9kSBy-iaXRnGjYzuQtw05MJGGUmkqPFcopm2pJGh7q&source=gbs_api",
    language: "fr",
  },
  // {
  //   ...EMPTY_BOOK,
  //   id: "",
  //   title: "",
  //   authors: [""],
  //   description: "",
  //   categories: ["", ""],
  //   imageLink: "",
  //   language: "fr",
  // },
];

const DATA_BOOKS_INFO_AH: MyInfoBookFormType[] = [
  // Son odeur après la pluie
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2024,
    //month: 5,
    userNote: 5,
    userComments:
      "Beau et émouvant, mais parfois un peu trop litéraire et compliqué pour moi...",
  },
  // Aliénor T1
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2024,
    userNote: 4,
    userComments:
      "Roman avec des références historiques, j'ai beaucoup aimé ! 3 livres de 600 pages !",
  },
  // Aliénor T2
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2024,
    month: 10,
    userNote: 4,
    userComments:
      "Roman avec des références historiques, j'ai beaucoup aimé ! 3 livres de 600 pages !",
  },
  // Aliénor T3
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2025,
    month: 1,
    userNote: 4,
    userComments:
      "Roman avec des références historiques, j'ai beaucoup aimé ! 3 livres de 600 pages !",
  },
  // The Chocolate Touch
  {
    bookStatus: BookStatusEnum.booksInProgressList,
    userComments: "De bons avis... Je comprends pas tout mais ça va :)",
  },
  // Plus on est de fous
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2025,
    month: 2,
    userNote: 2,
    userComments:
      "Roman très léger sur des histoires de gens en hôpital psy, mais pas très intéressant je trouve...",
  },
  // Les pouvoirs insoupçonnés de l'intuition
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2025,
    month: 2,
    userNote: 4,
    userComments: "Intéressant !",
  },
  // The Happy Prince by Oscar Wilde
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2024,
    month: 11,
    userNote: 4,
    userComments: "Mignonnes petites nouvelles en anglais.",
  },
  // L'homme qui rit
  {
    bookStatus: BookStatusEnum.booksToReadList,
    userComments: "Dans mes prochaines lectures...",
  },
  // Les Hauts de Hurle-vent
  {
    bookStatus: BookStatusEnum.booksToReadList,
    userComments: "Dans mes prochaines lectures...",
  },
  //   Le Grand voyage de la Marie-Amélie
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2024,
    userNote: 5,
    userComments:
      "Super livre sur l'esclavage ! Poignant, beau et dur à la fois !",
  },
  // Desert
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2024,
    userNote: 4,
    userComments:
      "Un peu long parfois... Mais très beau ! (je n'ai pas trouvé la version FR ici pourtant je l'ai lu en français)",
  },
  // Le Silence de la ville blanche
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2024,
    userNote: 4,
    userComments: "Polar, pas mal.",
  },
  // Vieille fille - Une proposition
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2025,
    userNote: 4,
    userComments: "Intéressant, on peut se sentir bien seule !",
  },
  // La Porte des mondes
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2025,
    userNote: 4,
    userComments: "Fiction, fait voyager !",
  },
  // Wild (Movie Tie-in Edition) 				FRANCE
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2025,
    userNote: 5,
    userComments:
      "J'ai adoré ! On part en rando avec elle ! (pas trouvé version française ici pourtant je l'ai lu en français)",
  },
  // Les Chaussures italiennes
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2025,
    userNote: 4,
    userComments: "Sympa",
  },
  // La rencontre, une philosophie
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2025,
    userNote: 4,
    userComments: "L'importance des rencontres...",
  },
  // Immortelle randonnée
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2025,
    userNote: 5,
    userComments: "Très sympa, et marrant !",
  },
  //   Donne-moi des ailes
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2022,
    userNote: 5,
    userComments: "Voyage avec les oies sauvages... J'ai adoré !",
  },
  // Le Hobbit
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2022,
    userNote: 3,
    userComments: "Parfois très long...",
  },
  // Le Seigneur des Anneaux T1 La fraternité de l'anneau
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2022,
    userNote: 4,
    userComments: "Super ! Même si parfois un peu long...",
  },
  // {
  //   bookStatus: BookStatusEnum.booksReadList,
  // year: 2025,
  //   userNote: 4,
  //   userComments: "Dans mes prochaines lectures...",
  // },
];

const DATA_BOOKS_INFO_AAA: MyInfoBookFormType[] = [
  // Son odeur après la pluie
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2022,
    month: 5,
    userNote: 5,
    userComments: "Super !!!",
  },
  // Aliénor T1
  {
    bookStatus: BookStatusEnum.booksInProgressList,
    userComments: "J'aime beaucoup pour l'instant...",
  },
  // Aliénor T2
  {
    bookStatus: BookStatusEnum.booksToReadList,
    userComments: "T2 à lire !!!",
  },
  // Aliénor T3
  {
    bookStatus: BookStatusEnum.booksToReadList,
    userComments: "T3 à lire !!!",
  },
  // The Chocolate Touch
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2020,
    userNote: 4,
    userComments: "Good",
  },
  // Plus on est de fous
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2015,
    userNote: 1,
    userComments: "Bof...",
  },
  // Les pouvoirs insoupçonnés de l'intuition
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2005,
    userNote: 5,
    userComments: "Whaou !!!",
  },
  // The Happy Prince by Oscar Wilde
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2004,
    userComments: "Sweet...",
  },
  // L'homme qui rit
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2003,
    userNote: 4,
    userComments: "Super !!!",
  },
  // Les Hauts de Hurle-vent
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2002,
    userNote: 4,
    userComments: "Super !!!",
  },
  //   Le Grand voyage de la Marie-Amélie
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2020,
    userNote: 5,
    userComments: "Super !",
  },
  // Desert
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2024,
    userNote: 3,
    userComments: "",
  },
  // Le Silence de la ville blanche
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2000,
    userNote: 3,
    userComments: "",
  },
  // Vieille fille - Une proposition
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2025,
    month: 1,
    userNote: 3,
    userComments: "Intéressant !",
  },
  // La Porte des mondes
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2025,
    month: 2,
    userNote: 4,
    userComments: "",
  },
  // Wild (Movie Tie-in Edition)
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2024,
    month: 11,
    userNote: 5,
    userComments: "Génail !",
  },
  // Les Chaussures italiennes
  {
    bookStatus: BookStatusEnum.booksToReadList,
    userComments: "",
  },
  // La rencontre, une philosophie
  {
    bookStatus: BookStatusEnum.booksInProgressList,
    userComments: "Sympa pour l'instant...",
  },
  // Immortelle randonnée
  {
    bookStatus: BookStatusEnum.booksToReadList,
    userComments: "A lire !!!!!!!!",
  },
  //   Donne-moi des ailes
  {
    bookStatus: BookStatusEnum.booksToReadList,
    userComments: "Apparemment super livre !",
  },
  // Le Hobbit
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2002,
    userNote: 3,
    userComments: "...",
  },
  // Le Seigneur des Anneaux T1 La fraternité de l'anneau
  {
    bookStatus: BookStatusEnum.booksReadList,
    year: 2000,
    userNote: 4,
    userComments: "Sympa...",
  },
  // {
  //   bookStatus: BookStatusEnum.booksReadList,
  // year: 2025,
  //   userNote: 4,
  //   userComments: "Dans mes prochaines lectures...",
  // },
];

const AdminPage = (): JSX.Element => {
  const { currentUser } = useUserStore();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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

  // !! With .then it doesn't work! (the books are added but the user info only adds one book!)
  const addBooksAndUsersInfos = async (
    userId: string | undefined,
    dataBooksInfo: MyInfoBookFormType[]
  ) => {
    for (let index = 0; index < DATA_BOOKS.length; index++) {
      await addBookFirebase(userId, DATA_BOOKS[index], dataBooksInfo[index]);
    }
  };

  return (
    <div className="m-auto min-h-screen max-w-3xl">
      <Title>Admin Page</Title>
      <Title level={2}>AJOUT</Title>

      <ol className="m-2 flex flex-col gap-4">
        <li>Créer compte AAA</li>
        <li>Créer compte AH</li>
        <li>AJOUTER l'id de AAA dans fonction addBooksAndUsersInfos</li>
        <li>Mettre AH en ADMIN</li>
        <li>Clic sur BOUTON Ajouter livres + infos user AH</li>
        <li>Clic sur BOUTON Ajouter livres + infos user AAA</li>
      </ol>
      {isAdmin ? (
        <div className="flex flex-col gap-4">
          <Button
            className="bg-primary/80"
            onClick={() =>
              addBooksAndUsersInfos(currentUser?.uid, DATA_BOOKS_INFO_AH)
            }
          >
            Ajouter livres + infos user AH
          </Button>
          <Button
            className="flex gap-6 bg-secondary/50"
            onClick={() =>
              addBooksAndUsersInfos(
                "B2GY4BUoZoRWe5hrhgGksWv82AN2",
                DATA_BOOKS_INFO_AAA
              )
            }
          >
            <span className="text-xl font-bold text-red-500">
              REMPLACER L'ID !!!
            </span>
            Ajouter livres + infos user AAA
          </Button>
          <Button className="bg-red-900" onClick={deleteAllDatas}>
            Supprimer toutes les données
          </Button>
          <Title level={2}>SUPPRESSION</Title>
          <ol className="m-2 flex flex-col gap-4">
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
