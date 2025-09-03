"use client"

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const clientCareFaqItems = [
    { 
      question: "HOW LONG WILL IT TAKE TO GET MY ORDER?",
      answer: "This is where the answer would appear. You can replace this with the actual content for each FAQ item."
    },
    { 
      question: "WHAT IF I NEED HELP PLACING AN ORDER THROUGH YOUR WEBSITE?",
      answer: "This is where the answer would appear. You can replace this with the actual content for each FAQ item."
    },
    { 
      question: "WHAT TYPE OF WARRANTY DO I RECEIVE?",
      answer: "This is where the answer would appear. You can replace this with the actual content for each FAQ item."
    },
    { 
      question: "DO YOU SHIP WORLDWIDE?",
      answer: "This is where the answer would appear. You can replace this with the actual content for each FAQ item."
    },
    { 
      question: "CAN I JUST DROP IN TO THE SHOWROOM?",
      answer: "This is where the answer would appear. You can replace this with the actual content for each FAQ item."
    },
    { 
      question: "HOW DO I FIND OUT MY RING SIZE?",
      answer: "This is where the answer would appear. You can replace this with the actual content for each FAQ item."
    },
    { 
      question: "CAN YOU HELP ME KEEP MY PURCHASE A SURPRISE?",
      answer: "This is where the answer would appear. You can replace this with the actual content for each FAQ item."
    },
    { 
      question: "WHAT PAYMENT METHODS DO YOU ACCEPT?",
      answer: "This is where the answer would appear. You can replace this with the actual content for each FAQ item."
    },
    { 
      question: "CAN I RETURN A PRODUCT?",
      answer: "This is where the answer would appear. You can replace this with the actual content for each FAQ item."
    },
    { 
      question: "THE FIT OF MY RING IS NOT QUITE RIGHT, CAN I RESIZE IT?",
      answer: "This is where the answer would appear. You can replace this with the actual content for each FAQ item."
    }
  ];

  const labGrownDiamondFaqItems = [
    {
      question: "ARE LAB GROWN DIAMONDS REAL?",
      answer: "Yes! Lab grown diamonds, also known as laboratory grown diamonds or ethical lab grown diamonds, are chemically identical to mined diamonds or natural diamonds. They offer the same level of beauty and are an extremely popular choice."
    },
    {
      question: "WHAT IS THE DIFFERENCE BETWEEN A SIMULANT AND A LAB GROWN DIAMOND?",
      answer: "A lab grown diamond, unlike a simulant, has the same chemical and physical properties as a mined diamond. They are aesthetically identical to naturally mined diamonds, offering the same fire and brilliance."
    },
    {
      question: "WHAT IS THE DIFFERENCE BETWEEN A MINED DIAMOND AND A LAB GROWN DIAMOND?",
      answer: "The only difference between a mined diamond and a lab grown diamond is their origin. Lab grown diamonds are an ethical and sustainable option, offering the same fire, clarity, and carat weights as mined diamonds."
    },
    {
      question: "ARE LAB GROWN DIAMONDS ETHICAL?",
      answer: "Lab grown diamonds are a sustainable option, created using advanced technology under high pressure, which is much more ethical than traditional diamond mining methods."
    },
    {
      question: "HOW DOES CULLEN JEWELLERY ENSURE A SEAMLESS PURCHASE EXPERIENCE?",
      answer: "We specialise in lab grown diamond engagement rings. Our collection, available to shop online, ranges in carat weight and design, ensuring you find the perfect diamond for your needs."
    },
    {
      question: "ARE LAB GROWN DIAMONDS LESS EXPENSIVE THAN MINED DIAMONDS?",
      answer: "Lab grown diamonds are an excellent alternative to mined diamonds as they provide much more value. Without sacrificing quality for price, lab grown diamonds will be more affordable than mined diamonds of the same quality and size."
    },
    {
      question: "ARE LAB CREATED DIAMONDS FLAWLESS?",
      answer: "Just like their mined counterparts, every lab created diamond is unique. Grown under the same intense heat and pressure as a mined diamond, a lab grown diamond undergoes the same growth process and may still contain minor internal or surface imperfections like a mined diamond will. This means every lab grown diamond will vary in colour, clarity and cut. Expert gemological labs such as the IGI and GIA evaluate and certify every single lab created diamond using the same strict standards applied to mined diamonds."
    },
    {
      question: "DO LAB GROWN DIAMONDS GET CLOUDY?",
      answer: "Absolutely not! Since lab grown diamonds have the exact same physical and chemical properties as mined diamonds, they are just as durable and scratch-resistant, meaning they will never become cloudy."
    },
    {
      question: "WHAT IS THE HISTORY OF LAB GROWN DIAMONDS?",
      answer: "Scientists have attempted to grow diamonds in a laboratory since the late 1800s. The first company to successfully produce large quantities of lab grown diamonds was General Electric in the 1950s. However, these were largely created for industrial use and were not suitable to be worn in fine jewellery. Gem quality lab grown diamonds have only been available from the late 1980s."
    },
    {
      question: "WILL A LAB GROWN DIAMOND PASS A DIAMOND TESTER?",
      answer: "Yes, lab grown diamonds will pass a diamond tester. Since lab grown diamonds are made of pure carbon and have the same thermal conductivity and chemical properties as real diamonds, they will record a positive test on a diamond tester."
    },
    {
      question: "ARE YOUR LAB GROWN DIAMONDS LASER INSCRIBED?",
      answer: "To ensure consistency of certification, every lab created diamond is inspected and certified by a gemological expert at the IGI. Using a very fine and precise laser beam, every lab grown diamond is inscribed with the report number and the words \"lab grown\", assuring you of your diamond's origin and authentic certification. This inscription is invisible to the naked eye and can only be seen under a jeweller's loupe. In no way will this impact your diamond's quality or light performance."
    },
    {
      question: "ARE YOUR LAB GROWN DIAMONDS CERTIFIED?",
      answer: "Absolutely! All of our lab grown diamonds are evaluated on cut, clarity, colour and carat weight and are IGI or GIA certified. Most of our lab grown diamonds are certified by the leading lab grown gemological institute, IGI. The IGI is the most popular lab-created diamond certifier and is used by most of the lab market, creating a consistency in grading across the lab grown diamond industry. This allows the consumers to easily compare lab grown diamonds and to be assured they're getting what they're paying for."
    },
    {
      question: "ARE LAB GROWN DIAMONDS TRULY CONFLICT-FREE?",
      answer: "Lab grown diamonds are produced in controlled laboratory environments and do not need to be mined from the earth. Unlike mined diamonds, only lab created diamonds can be 100% conflict-free. It is near impossible to know the origins of a mined diamond and whether unsafe or unethical labour practices were involved in its extraction from the earth."
    },
    {
      question: "ARE LAB GROWN DIAMONDS TRULY ECO-FRIENDLY?",
      answer: "Lab grown diamonds are the eco-friendly alternative to mined diamonds. Did you know that over 250 tons of ore must be moved just to mine 1 carat of mined diamond? By removing the need for mining, lab grown diamonds reduce the devastating impact on the environment and ensure mined habitats, fauna and ancestral communities were unharmed in their production."
    },
    {
      question: "DO YOU ALSO SELL MINED DIAMONDS?",
      answer: "No, we do not sell mined diamonds. At Cullen Jewellery, we are committed to ensuring all of our diamonds come 100% conflict-free. Lab created diamonds are the only diamonds that can be fully traced to their origin, allowing us to deliver ethical, environmentally-friendly jewellery to our clients, every time."
    },
    {
      question: "WHY SHOULD I PURCHASE A LAB GROWN DIAMOND RING FROM CULLEN JEWELLERY?",
      answer: "We believe that every couple deserves a ring that is as unique as their love, and our skilled craftsmen take great pride in creating beautiful lab grown diamond rings for special occasions that will be cherished for a lifetime. Lab grown diamonds are identical to mined diamonds, with the same fire scintillation and sparkle. With highly specialised equipment and cutting-edge technology, the necessary conditions (such as extreme pressure) are replicated in a lab to produce a lab grown diamond. Specific trace elements can differ, though they are physically identical.\n\nOur high-quality, certified lab grown diamonds are the perfect choice for an engagement ring. They are conflict-free, eco-friendly, and available in a wide range of shapes and settings. And because they are grown in a laboratory with cutting-edge technology in a sustainable process, they are perfectly uniform in quality and clarity — the closest thing to perfect diamonds. Indeed, they have the same fire and optical properties as a mined diamond formed in the earth's mantle. When you purchase a Cullen Jewellery diamond engagement ring or wedding band, you can be confident that you are getting a ring that is truly special with a gem certification identifying them as legitimate."
    }
  ];

  const moissaniteFaqItems = [
    {
      question: "IS MOISSANITE WORTH BUYING?",
      answer: "Moissanite is a brilliant choice for those seeking an alternative to a lab diamond engagement ring. It offers exceptional clarity and is hand-selected and inspected by our expert quality control team to ensure the best quality, just like our lab grown diamond collections."
    },
    {
      question: "CAN MOISSANITE PASS DIAMOND TESTER?",
      answer: "Yes. Due to its similar properties to diamonds (both lab grown and mined or natural diamond rings), moissanite can pass a diamond tester. However, our specialised equipment can distinguish between moissanite and diamonds, ensuring you know exactly what you're purchasing."
    },
    {
      question: "IS MOISSANITE THE BEST FAKE DIAMOND?",
      answer: "Moissanite is not a fake diamond but a gemstone that offers stunning lab grown beauty. It's perfect for those looking for the same level of sparkle and clarity found in diamonds, but at a more accessible price point."
    },
    {
      question: "ARE MOISSANITE RINGS TACKY?",
      answer: "Absolutely not! Due to its diamond-like appearance, many people believe the misconception that moissanite is a fake diamond when it is in fact a high quality, beautiful gemstone in its own right. Moissanite is becoming an increasingly popular choice of stone in engagement rings due to its dazzling beauty, durability, ease of customisation and affordability."
    },
    {
      question: "DO MOISSANITE RINGS LOOK FAKE?",
      answer: "No, moissanite rings are crafted to exhibit a sparkle that, to the naked eye, is akin to that of diamonds. They offer timeless beauty and are an aesthetically identical choice for those who admire the appearance of mined diamonds."
    },
    {
      question: "DOES MOISSANITE LOSE ITS SPARKLE?",
      answer: "Moissanite retains its sparkle indefinitely, much like our lab grown and rings. Its clarity and carat weight remain intact, ensuring a lifetime of brilliance."
    },
    {
      question: "HOW CAN I FIND THE PERFECT MOISSANITE ENGAGEMENT RING AT CULLEN JEWELLERY?",
      answer: "We make it easy to find your ideal moissanite engagement ring. Request a free ring sizer to determine your correct ring size, and browse our wide selection of moissanite engagement rings on our website. To create a custom ring design, schedule an appointment with our expert team, providing your appointment details. Our specialists will assist you with the entire custom design process to ensure you get the perfect ring. A regular price at Cullen Jewellery offers better accessibility and exceptional value compared to other jewellers."
    },
    {
      question: "WHAT IS A MOISSANITE DIAMOND? IS IT REAL?",
      answer: "A moissanite diamond does not exist. Despite having a similar appearance to a diamond, a moissanite is a real, beautiful gemstone all its own. First discovered in a meteor crater by Henry Moissan in 1893, moissanite is now produced in labs, making this gem both affordable and ethical. Moissanite stones are bright and eye-catching, with a high clarity grade, colourless beauty and sparkling fire. With a hardness rating of 9.25-9.5, moissanite is incredibly durable and is guaranteed to outlast a lifetime of daily wear. Available in a variety of sizes and shapes, moissanite provides buyers with more freedom for custom designs and can be purchased for the fraction of the price of a diamond of the same size and quality."
    },
    {
      question: "CAN YOU SHOWER WITH A MOISSANITE RING?",
      answer: "Yes, you can shower with a moissanite ring. However, the more you come in contact with soaps, dirt and chemicals, the faster oils and dirt can build up on the surface of your ring. This can be easily cleaned off but to ensure a longer-lasting sparkle, we recommend avoiding washing dishes or doing heavy housework whilst wearing your ring."
    },
    {
      question: "CAN YOU SCRATCH MOISSANITE?",
      answer: "No, you can't scratch moissanite. As it is one of the most durable substances on earth, moissanite is highly resistant to scratching or breaking. With a hardness rating of 9.25 – 9.5, moissanite is harder than all other gemstones besides diamonds, and can only be scratched by a diamond or another moissanite stone – which is unlikely to occur!"
    },
    {
      question: "IS IT BAD TO GET A MOISSANITE ENGAGEMENT RING?",
      answer: "Getting a moissanite engagement ring is one of the best gifts you could ever receive! Though similar to a diamond in appearance, moissanite is a unique, standalone gemstone – Like lab grown diamonds, it is an ethical, sustainable and affordable engagement ring choice. Not only does moissanite have a unique extra sparkle, it is also extremely durable and is suitable for a lifetime of daily wear. The lasting durability, beauty and sustainability of moissanite makes it a popular choice for those who want to make responsible, cost-effective jewellery choices without sacrificing on quality."
    },
    {
      question: "HOW MUCH IS A 1 CARAT MOISSANITE WORTH?",
      answer: "A 1 carat moissanite is worth approximately $990 AUD but will vary depending on the cut of your stone. You can find pricing for moissanite loose stones of every shape and size here."
    },
    {
      question: "WHY SHOULD I PURCHASE A MOISSANITE ENGAGEMENT RING FROM CULLEN JEWELLERY?",
      answer: "Have you been dreaming of the perfect engagement ring but aren't sure where to start? Look no further than a unique Cullen moissanite ring. We have a wide selection of moissanite rings with many characteristics, so you can find your dream ring to match your style. The durability of moissanite means you can create the perfect ring that will have the sparkle, fire, and brilliance that lasts forever. Our expert jewellers combine our stunning gems in any shape with beautiful ring settings to capture your vision impeccably. Our free ring sizer lets you know your ring size before scheduling a virtual appointment or visiting our showroom. As a world-leading brand, you can rest assured that you don't have to wait any longer for the modern engagement ring you've been looking for.\n\nWe sell a variety of moissanite gems, including oval cut, round brilliant, and other classic shapes and new styles in settings such as pavé and solitaire. Shopping with Cullen Jewellery for yourself or your partner means you can be assured that you will get the dream ring in style, guaranteed. So, schedule your appointment today!"
    }
  ];

  const sapphireFaqItems = [
    {
      question: "WHAT ARE LAB GROWN SAPPHIRES?",
      answer: "Lab grown sapphires are marvels of modern science, created in controlled environments that replicate the natural processes of mined sapphires. They share the same chemical composition, crystal structure, and physical properties as their mined counterparts. So choosing a lab grown sapphire is definitely the responsible choice!"
    },
    {
      question: "HOW ARE LAB GROWN SAPPHIRES MADE?",
      answer: "Our lab grown sapphires are crafted using the Czochralski process. This involves melting aluminium oxide and inserting a rod with a seed crystal. As the rod is gently rotated and pulled, a stunning column of sapphire emerges, ready to be cut, polished and transformed into your next cherished piece."
    },
    {
      question: "WHAT COLOURS OF LAB GROWN SAPPHIRES ARE AVAILABLE?",
      answer: "At Cullen Jewellery, we offer an exquisite palette of lab grown sapphires in blue, pink, purple, and red. Trace elements like iron, titanium, and chromium influence the vibrant hues of each sapphire."
    },
    {
      question: "WHAT ARE THE ADVANTAGES OF LAB GROWN SAPPHIRES OVER MINED SAPPHIRES?",
      answer: "Lab grown sapphires offer brilliant benefits. They are more cost-effective and free from the ethical concerns tied to mining. Plus, they boast fewer inclusions and more consistent colour, making them a responsible choice for conscientious jewellery lovers."
    },
    {
      question: "HOW SHOULD I CARE FOR AND MAINTAIN MY LAB GROWN SAPPHIRE JEWELLERY?",
      answer: "Thanks to their impressive durability, our lab-grown sapphires are perfect for everyday wear. Clean them with warm, soapy water, ultrasonic cleaners, or steam cleaners. To keep them pristine, store them separately to avoid scratches from harder gemstones like diamonds."
    },
    {
      question: "WHAT IS THE DIFFERENCE BETWEEN LAB GROWN SAPPHIRES AND MINED SAPPHIRES?",
      answer: "Lab grown and mined sapphires are identical twins in terms of chemical composition, crystal structure, and physical properties. The key difference is their origin: lab grown sapphires are born in controlled environments, while mined sapphires are formed over millions of years in the Earth's crust."
    },
    {
      question: "WHAT IS THE HARDNESS OF LAB GROWN SAPPHIRES?",
      answer: "Our lab grown sapphires boast a hardness of 9 on the Mohs scale, making them incredibly durable and scratch-resistant—ideal for jewellery that stands the test of time."
    },
    {
      question: "CAN I INCORPORATE LAB GROWN SAPPHIRES INTO EXISTING JEWELLERY DESIGNS?",
      answer: "Absolutely! Cullen Jewellery offers a stunning range of lab grown sapphires that can be seamlessly incorporated into your existing jewellery designs. Whether you need loose stones or completed pieces, we've got you covered."
    },
    {
      question: "WHAT IS THE DIFFERENCE BETWEEN A SAPPHIRE AND A RUBY?",
      answer: "Sapphires and rubies are both members of the corundum family. The primary distinction lies in their colour: sapphires typically exhibit blue hues, while rubies are renowned for their rich red shades, courtesy of chromium."
    },
    {
      question: "WHAT MAKES CULLEN JEWELLERY'S LAB GROWN SAPPHIRES UNIQUE?",
      answer: "This answer would be completed based on your specific unique selling points for sapphires."
    }
  ];

  const FAQSection = ({ title, items, startIndex }) => (
    <div className="mb-12">
      <h2 className="text-2xl md:text-2xl lg:text-3xl font-arizona font-light text-gray-800 mb-8">{title}</h2>
      
      <div className="space-y-1">
        {items.map((item, index) => {
          const globalIndex = startIndex + index;
          return (
            <div key={globalIndex} className="border-b border-gray-400">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleItem(globalIndex);
                }}
                className="w-full flex items-center py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="transition-transform duration-300 ease-in-out">
                  {openItems[globalIndex] ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 mr-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 mr-4" />
                  )}
                </div>
                <span className="text-gray-700 font-medium text-[10px] font-gintoNord tracking-wide">
                  {item.question}
                </span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openItems[globalIndex] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="pb-4 px-4">
                  <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className='w-full bg-white'>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-800 mb-4 font-arizona">FAQs</h1>
          <div className="w-16 h-1 bg-gray-400 mx-auto mb-8"></div>
          <p className="text-gray-600 mb-8 font-gintoNormal">
            If you have any questions at all that we do not cover below please{' '}
            <span className="text-blue-600 underline cursor-pointer">get in touch via our Contact page</span>.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button className="btn text-white px-6 py-3 text-[10px] font-medium font-gintoNord tracking-wide hover:bg-green-800 transition-colors">
              LAB GROWN DIAMOND FAQS
            </button>
            <button className="btn text-white px-6 py-3 text-[10px] font-medium font-gintoNord tracking-wide hover:bg-green-800 transition-colors">
              MOISSANITE FAQS
            </button>
          </div>
        </div>

        {/* FAQ Sections */}
        <FAQSection 
          title="Client Care FAQs" 
          items={clientCareFaqItems} 
          startIndex={0}
        />
        
        <FAQSection 
          title="Lab Grown Diamond FAQs" 
          items={labGrownDiamondFaqItems} 
          startIndex={clientCareFaqItems.length}
        />
        
        <FAQSection 
          title="Moissanite FAQs" 
          items={moissaniteFaqItems} 
          startIndex={clientCareFaqItems.length + labGrownDiamondFaqItems.length}
        />
        
        <FAQSection 
          title="Sapphire FAQs" 
          items={sapphireFaqItems} 
          startIndex={clientCareFaqItems.length + labGrownDiamondFaqItems.length + moissaniteFaqItems.length}
        />
      </div>
    </div>
  );
};

export default FAQ;