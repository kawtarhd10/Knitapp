// Leçons : une technique par écran, en mots simples.
// term : comment on l'écrit dans les modèles. Montré seulement APRÈS que la leçon est apprise.
// Vidéo : videos/<id>.mp4 dans le dépôt si elle existe (voir videos/README.md),
// sinon la vidéo YouTube indiquée par « youtube » (identifiant après « watch?v= »).
export const LESSONS = [
  {
    id: 'cast-on',
    youtube: 'mRyAM0eLjJw', // Tutoriel Tricot Débutant, leçon 2 : montage simple
    term: { fr: 'monter', en: 'CO' },
    fr: {
      name: 'Monter les mailles',
      steps: [
        'Faites un petit nœud coulant et mettez-le sur une aiguille.',
        'Enroulez le fil autour du pouce, piquez l’aiguille dans la boucle.',
        'Serrez doucement : une nouvelle maille est sur l’aiguille.',
        'Recommencez jusqu’au bon nombre de mailles.',
      ],
      tip: 'Ne serrez pas trop, sinon le premier rang sera difficile.',
      search: 'tricot monter les mailles débutant',
    },
    ar: {
      name: 'تركيب الغرز',
      steps: [
        'اصنعي عقدة صغيرة منزلقة وضعيها على الإبرة.',
        'لفّي الخيط حول الإبهام، وأدخلي الإبرة في الحلقة.',
        'اشدّي بلطف: صارت غرزة جديدة على الإبرة.',
        'كرري حتى تصلي إلى العدد المطلوب.',
      ],
      tip: 'لا تشدّي كثيراً حتى يسهل الصف الأول.',
      search: 'تعلم تركيب الغرز تريكو للمبتدئين',
    },
  },
  {
    id: 'knit',
    youtube: 'sgCk7lwW2mQ', // Tutoriel Tricot Débutant, leçon 3 : la maille endroit
    term: { fr: 'm. end.', en: 'k' },
    fr: {
      name: 'Maille endroit',
      steps: [
        'Le fil est derrière le tricot.',
        'Piquez l’aiguille droite dans la maille, de l’avant vers l’arrière.',
        'Enroulez le fil autour de l’aiguille droite.',
        'Ramenez la boucle vers vous et laissez glisser l’ancienne maille.',
      ],
      tip: 'Répétez dans le même ordre : piquer, enrouler, ramener, glisser.',
      search: 'tricot maille endroit débutant',
    },
    ar: {
      name: 'الغرزة السادة',
      steps: [
        'الخيط خلف العمل.',
        'أدخلي الإبرة اليمنى في الغرزة من الأمام إلى الخلف.',
        'لفّي الخيط حول الإبرة اليمنى.',
        'اسحبي الحلقة نحوك واتركي الغرزة القديمة تنزلق.',
      ],
      tip: 'كرري بنفس الترتيب: أدخلي، لفّي، اسحبي، اتركي.',
      search: 'تعلم الغرزة السادة تريكو',
    },
  },
  {
    id: 'garter',
    youtube: 'M8du_FqQQkM', // Tricot débutant : comment tricoter le point mousse
    term: { fr: 'pt mousse', en: 'garter st' },
    fr: {
      name: 'Point mousse',
      steps: [
        'Tricotez toutes les mailles en maille endroit.',
        'À la fin du rang, tournez le tricot.',
        'Recommencez : encore tout en maille endroit.',
        'Des petites vagues apparaissent des deux côtés.',
      ],
      tip: 'Ce tricot ne roule pas : parfait pour débuter.',
      search: 'tricot point mousse débutant',
    },
    ar: {
      name: 'غرزة موس',
      steps: [
        'احيكي كل الغرز بالغرزة السادة.',
        'في آخر الصف اقلبي العمل.',
        'أعيدي: كل الغرز سادة مرة أخرى.',
        'تظهر تموجات صغيرة على الجهتين.',
      ],
      tip: 'هذا العمل لا يلتف: مثالي للبداية.',
      search: 'غرزة موس تريكو للمبتدئين',
    },
  },
  {
    id: 'bind-off',
    youtube: 'oRp-Y33ZYZA', // Tutoriel Tricot Débutant, leçon 5 : rabattre et rentrer les fils
    term: { fr: 'rab.', en: 'BO' },
    fr: {
      name: 'Rabattre les mailles',
      steps: [
        'Tricotez 2 mailles.',
        'Avec l’aiguille gauche, passez la première maille par-dessus la deuxième.',
        'Il reste 1 maille. Tricotez-en une autre, et recommencez.',
        'À la fin, coupez le fil et passez-le dans la dernière maille.',
      ],
      tip: 'Restez souple pour que le bord ne serre pas.',
      search: 'tricot rabattre les mailles',
    },
    ar: {
      name: 'قفل الغرز',
      steps: [
        'احيكي غرزتين.',
        'بالإبرة اليسرى مرّري الغرزة الأولى فوق الثانية.',
        'بقيت غرزة واحدة. احيكي غرزة أخرى وكرري.',
        'في النهاية اقطعي الخيط ومرّريه في آخر غرزة.',
      ],
      tip: 'لا تشدّي كثيراً حتى لا تضيق الحافة.',
      search: 'طريقة قفل الغرز تريكو',
    },
  },
  {
    id: 'weave-ends',
    youtube: 'oRp-Y33ZYZA', // Tutoriel Tricot Débutant, leçon 5 : rabattre et rentrer les fils
    term: { fr: 'rentrer les fils', en: 'weave in ends' },
    fr: {
      name: 'Cacher les bouts de fil',
      steps: [
        'Enfilez le bout de fil dans une aiguille à laine.',
        'Passez-le dans quelques mailles, sur l’envers du tricot.',
        'Revenez dans l’autre sens sur quelques mailles.',
        'Coupez le fil près du tricot.',
      ],
      tip: 'Laissez toujours 15 cm de fil au début et à la fin.',
      search: 'tricot rentrer les fils',
    },
    ar: {
      name: 'إخفاء أطراف الخيط',
      steps: [
        'أدخلي طرف الخيط في إبرة الصوف.',
        'مرّريه داخل بعض الغرز على ظهر العمل.',
        'ارجعي في الاتجاه المعاكس على بعض الغرز.',
        'اقطعي الخيط قريباً من العمل.',
      ],
      tip: 'اتركي دائماً 15 سم من الخيط في البداية والنهاية.',
      search: 'إخفاء الخيوط في التريكو',
    },
  },
  {
    id: 'purl',
    youtube: 's6F-wqwmCts', // Tutoriel Tricot Débutant, leçon 4 : la maille envers
    term: { fr: 'm. env.', en: 'p' },
    fr: {
      name: 'Maille envers',
      steps: [
        'Le fil est devant le tricot.',
        'Piquez l’aiguille droite dans la maille, de l’arrière vers l’avant.',
        'Enroulez le fil autour de l’aiguille droite.',
        'Ramenez la boucle vers l’arrière et laissez glisser l’ancienne maille.',
      ],
      tip: 'C’est la maille endroit « à l’envers » : même geste, côté opposé.',
      search: 'tricot maille envers débutant',
    },
    ar: {
      name: 'الغرزة المقلوبة',
      steps: [
        'الخيط أمام العمل.',
        'أدخلي الإبرة اليمنى في الغرزة من الخلف إلى الأمام.',
        'لفّي الخيط حول الإبرة اليمنى.',
        'اسحبي الحلقة إلى الخلف واتركي الغرزة القديمة تنزلق.',
      ],
      tip: 'هي عكس الغرزة السادة: نفس الحركة من الجهة الأخرى.',
      search: 'تعلم الغرزة المقلوبة تريكو',
    },
  },
  {
    id: 'rib-2x2',
    youtube: 'Ep5JYheQCOc', // Apprendre le tricot : les côtes 2/2
    term: { fr: 'côtes 2/2', en: 'k2, p2 rib' },
    fr: {
      name: 'Côtes 2/2',
      steps: [
        '2 mailles endroit, puis 2 mailles envers.',
        'Avant chaque maille envers, passez le fil devant. Avant chaque maille endroit, passez-le derrière.',
        'Au rang suivant, tricotez ce que vous voyez : un « V » se tricote endroit, une petite bosse se tricote envers.',
        'Des colonnes en relief apparaissent : c’est élastique.',
      ],
      tip: 'Si le fil reste du mauvais côté, un trou apparaît : vérifiez à chaque changement.',
      search: 'tricot côtes 2/2',
    },
    ar: {
      name: 'ضلوع 2/2',
      steps: [
        'غرزتان سادة، ثم غرزتان مقلوبتان.',
        'قبل كل غرزة مقلوبة ضعي الخيط أمام العمل، وقبل كل غرزة سادة ضعيه خلفه.',
        'في الصف التالي احيكي ما ترينه: شكل «V» يُحاك سادة، والنتوء الصغير يُحاك مقلوباً.',
        'تظهر أعمدة بارزة: العمل مطاطي.',
      ],
      tip: 'إذا بقي الخيط في الجهة الخطأ يظهر ثقب: انتبهي عند كل تغيير.',
      search: 'غرزة الضلوع 2/2 تريكو',
    },
  },
  {
    id: 'new-ball',
    youtube: 'Thd29uCM144', // Comment changer de pelote
    term: { fr: 'changer de pelote', en: 'join new yarn' },
    fr: {
      name: 'Changer de pelote',
      steps: [
        'Changez toujours au début d’un rang, pas au milieu.',
        'Laissez 15 cm de l’ancien fil.',
        'Tricotez la première maille avec le nouveau fil, en laissant aussi 15 cm.',
        'Faites un nœud simple entre les deux bouts. Vous les cacherez à la fin.',
      ],
      tip: 'Quand il reste environ 4 fois la largeur du tricot en fil, c’est le moment de changer.',
      search: 'tricot changer de pelote',
    },
    ar: {
      name: 'تغيير كبة الصوف',
      steps: [
        'غيّري دائماً في بداية الصف، وليس في وسطه.',
        'اتركي 15 سم من الخيط القديم.',
        'احيكي الغرزة الأولى بالخيط الجديد، واتركي أيضاً 15 سم.',
        'اعقدي عقدة بسيطة بين الطرفين. ستخفينهما في النهاية.',
      ],
      tip: 'عندما يبقى من الخيط حوالي 4 مرات عرض العمل، حان وقت التغيير.',
      search: 'تغيير كبة الصوف تريكو',
    },
  },
  {
    id: 'dropped',
    youtube: 'SI0YHZdlqEE', // Rattraper une maille perdue avec un crochet
    term: { fr: 'maille filée', en: 'dropped stitch' },
    fr: {
      name: 'Rattraper une maille tombée',
      steps: [
        'Une maille est tombée ? Mettez vite une épingle dedans pour qu’elle ne descende plus.',
        'Derrière elle, vous voyez des barres de fil, comme une échelle.',
        'Avec un crochet, prenez la maille et tirez la barre au-dessus à travers.',
        'Remontez barre par barre, puis remettez la maille sur l’aiguille.',
      ],
      tip: 'Pas de panique : cela arrive à toutes les tricoteuses.',
      search: 'tricot rattraper une maille filée crochet',
    },
    ar: {
      name: 'استرجاع غرزة ساقطة',
      steps: [
        'سقطت غرزة؟ ضعي فيها دبوساً بسرعة حتى لا تنزل أكثر.',
        'خلفها ترين خطوطاً من الخيط مثل السلّم.',
        'بالكروشيه خذي الغرزة واسحبي الخط الذي فوقها من خلالها.',
        'اصعدي خطاً بخط، ثم أعيدي الغرزة إلى الإبرة.',
      ],
      tip: 'لا تقلقي: هذا يحدث لكل من تحيك.',
      search: 'استرجاع غرزة ساقطة تريكو',
    },
  },
  {
    id: 'stockinette',
    youtube: 's-tSFBw7j-4', // La maille envers et le point jersey
    term: { fr: 'jersey', en: 'St st' },
    fr: {
      name: 'Jersey',
      steps: [
        '1 rang : toutes les mailles en maille endroit.',
        'Rang suivant : toutes les mailles en maille envers.',
        'Et on recommence, un rang de chaque.',
        'D’un côté, des petits « V » bien lisses.',
      ],
      tip: 'Les bords roulent : c’est normal, ce n’est pas une erreur.',
      search: 'tricot point jersey',
    },
    ar: {
      name: 'غرزة الجيرسي',
      steps: [
        'صف: كل الغرز سادة.',
        'الصف التالي: كل الغرز مقلوبة.',
        'ونكرر، صف من كل نوع.',
        'من جهة تظهر حروف «V» صغيرة وملساء.',
      ],
      tip: 'الحواف تلتف: هذا طبيعي وليس خطأ.',
      search: 'غرزة الجيرسي تريكو',
    },
  },
  {
    id: 'k2tog',
    youtube: 'dScfnHGvnI0', // Un Amour de Laine : 2 mailles ensemble à l’endroit
    term: { fr: '2 m. ens.', en: 'k2tog' },
    fr: {
      name: 'Diminuer : 2 mailles ensemble',
      steps: [
        'Piquez l’aiguille droite dans 2 mailles à la fois.',
        'Tricotez-les comme une seule maille endroit.',
        'Il y a maintenant 1 maille de moins.',
        'C’est ce qui rend le haut d’un bonnet plus étroit.',
      ],
      tip: 'Comptez vos mailles après chaque rang de diminutions.',
      search: 'tricot 2 mailles ensemble endroit diminution',
    },
    ar: {
      name: 'التنقيص: غرزتان معاً',
      steps: [
        'أدخلي الإبرة اليمنى في غرزتين معاً.',
        'احيكيهما كغرزة سادة واحدة.',
        'صار عدد الغرز أقل بواحدة.',
        'هكذا يضيق أعلى القبعة.',
      ],
      tip: 'عُدّي الغرز بعد كل صف تنقيص.',
      search: 'التنقيص في التريكو غرزتان معا',
    },
  },
  {
    id: 'seaming',
    youtube: 'p3PfoN3chEs', // Couture invisible au point de matelas
    term: { fr: 'assemblage', en: 'mattress st' },
    fr: {
      name: 'Coudre deux bords',
      steps: [
        'Posez les deux bords côte à côte, l’endroit vers vous.',
        'Avec l’aiguille à laine, prenez une barre de fil d’un côté.',
        'Puis une barre de l’autre côté, à la même hauteur.',
        'Tirez doucement tous les 3 ou 4 points : la couture devient presque invisible.',
      ],
      tip: 'Cousez avec la même laine que le tricot.',
      search: 'tricot couture point de matelas',
    },
    ar: {
      name: 'خياطة حافتين',
      steps: [
        'ضعي الحافتين جنباً إلى جنب، والوجه نحوك.',
        'بإبرة الصوف خذي خطاً من الخيط من جهة.',
        'ثم خطاً من الجهة الأخرى في نفس المستوى.',
        'اسحبي بلطف كل 3 أو 4 غرز: تصبح الخياطة شبه مخفية.',
      ],
      tip: 'خيطي بنفس صوف العمل.',
      search: 'خياطة قطع التريكو غرزة مخفية',
    },
  },
];
