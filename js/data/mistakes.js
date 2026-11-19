// Erreurs fréquentes pour « Est-ce juste ? ».
// picture : dessin montré à côté du dessin juste (voir js/views/pictures.js).
// lesson  : leçon qui aide à réparer.
// normal  : si « oui », ce n'est pas une erreur.
export const MISTAKES = [
  {
    id: 'dropped',
    picture: 'ladder',
    lesson: 'dropped',
    fr: {
      name: 'Maille tombée',
      question: 'Voyez-vous une échelle : des barres de fil horizontales, avec un trou qui descend ?',
      fix: [
        'Mettez tout de suite une épingle dans la maille tombée.',
        'Avec un crochet, remontez-la barre par barre.',
        'Remettez-la sur l’aiguille, dans le bon sens.',
      ],
    },
    ar: {
      name: 'غرزة ساقطة',
      question: 'هل ترين سلّماً: خطوطاً أفقية من الخيط مع ثقب ينزل؟',
      fix: [
        'ضعي فوراً دبوساً في الغرزة الساقطة.',
        'بالكروشيه اصعدي بها خطاً بخط.',
        'أعيديها إلى الإبرة في الاتجاه الصحيح.',
      ],
    },
  },
  {
    id: 'twisted',
    picture: 'twisted',
    fr: {
      name: 'Maille tordue',
      question: 'Certaines mailles ont-elles les deux jambes croisées, comme un « X » au lieu d’un « V » ?',
      fix: [
        'Sur l’aiguille, la jambe droite de chaque maille doit être devant.',
        'Si une maille est à l’envers sur l’aiguille, tricotez-la par la jambe de derrière : elle se redresse.',
        'Si elle est déjà plus bas dans le tricot, ce n’est pas grave : continuez, cela se voit à peine.',
        'Pour éviter cela : enroulez toujours le fil dans le même sens (comme sur la vidéo).',
      ],
    },
    ar: {
      name: 'غرزة ملتوية',
      question: 'هل لبعض الغرز ساقان متقاطعتان، مثل «X» بدل «V»؟',
      fix: [
        'على الإبرة، يجب أن تكون الساق اليمنى لكل غرزة في الأمام.',
        'إذا كانت غرزة مقلوبة على الإبرة، احيكيها من الساق الخلفية: ستستقيم.',
        'إذا كانت في الأسفل داخل العمل، فلا بأس: استمري، فهي بالكاد تظهر.',
        'لتجنب ذلك: لفّي الخيط دائماً في نفس الاتجاه (كما في الفيديو).',
      ],
    },
  },
  {
    id: 'hole',
    picture: 'hole',
    fr: {
      name: 'Trou en trop',
      question: 'Voyez-vous un petit trou rond, sans échelle en dessous ?',
      fix: [
        'Souvent, le fil est passé par-dessus l’aiguille par erreur : cela crée une maille en plus et un trou.',
        'Si c’est sur le rang que vous venez de faire : au rang suivant, tricotez cette boucle avec la maille d’à côté (2 mailles ensemble).',
        'Si c’est plus bas : c’est discret, vous pouvez continuer.',
      ],
    },
    ar: {
      name: 'ثقب زائد',
      question: 'هل ترين ثقباً صغيراً مستديراً، بدون سلّم تحته؟',
      fix: [
        'غالباً مرّ الخيط فوق الإبرة بالخطأ: هذا يصنع غرزة زائدة وثقباً.',
        'إذا كان في الصف الأخير: في الصف التالي احيكي هذه الحلقة مع الغرزة المجاورة (غرزتان معاً).',
        'إذا كان في الأسفل: هو غير ظاهر كثيراً، يمكنك الاستمرار.',
      ],
    },
  },
  {
    id: 'count',
    picture: 'extra',
    type: 'count',
    fr: {
      name: 'Nombre de mailles',
      question: 'Le tricot devient-il plus large ou plus étroit ? Comptez les mailles sur votre aiguille.',
      more: [
        'Vous avez des mailles en trop.',
        'Cause fréquente : au début du rang, le fil passe par-dessus l’aiguille et la première maille paraît double. Gardez le fil en bas au début de chaque rang.',
        'Pour corriger : tricotez 2 mailles ensemble près du bord, autant de fois que de mailles en trop.',
      ],
      fewer: [
        'Il vous manque des mailles.',
        'Cherchez d’abord une maille tombée (une échelle) et remontez-la.',
        'Sinon, vous avez peut-être tricoté 2 mailles ensemble sans le vouloir : au début du rang suivant, tricotez la première maille 2 fois (une fois devant, une fois derrière) pour en ajouter une.',
      ],
    },
    ar: {
      name: 'عدد الغرز',
      question: 'هل صار العمل أعرض أو أضيق؟ عُدّي الغرز على إبرتك.',
      more: [
        'لديك غرز زائدة.',
        'سبب شائع: في بداية الصف يمر الخيط فوق الإبرة فتبدو الغرزة الأولى مزدوجة. أبقي الخيط في الأسفل في بداية كل صف.',
        'للتصحيح: احيكي غرزتين معاً قرب الحافة، بعدد الغرز الزائدة.',
      ],
      fewer: [
        'تنقصك غرز.',
        'ابحثي أولاً عن غرزة ساقطة (سلّم) واسترجعيها.',
        'وإلا فربما حكتِ غرزتين معاً دون قصد: في بداية الصف التالي احيكي الغرزة الأولى مرتين (مرة من الأمام ومرة من الخلف) لإضافة غرزة.',
      ],
    },
  },
  {
    id: 'curl',
    picture: 'curl',
    normal: true,
    fr: {
      name: 'Bords qui roulent',
      question: 'Les bords de votre tricot s’enroulent-ils ?',
      fix: [
        'Ce n’est pas une erreur ! Le jersey (1 rang endroit, 1 rang envers) roule toujours.',
        'Une bordure en côtes ou en point mousse l’empêche de rouler, comme sur le bonnet.',
      ],
    },
    ar: {
      name: 'حواف ملتفة',
      question: 'هل تلتف حواف عملك؟',
      fix: [
        'هذا ليس خطأ! الجيرسي (صف سادة، صف مقلوب) يلتف دائماً.',
        'حافة من الضلوع أو من غرزة موس تمنعه من الالتفاف، كما في القبعة.',
      ],
    },
  },
];
