import React from 'react'
import Button from '../ui/button'
import MailIcon from '../icons/mail'
import ArrowIcon from '../icons/arrow'

export default function Footer() {
  return (
    <div className="2xl:max-w-[1560px] lg:max-w-[1280px] mx-auto lg:mt-28 mt-14 mb-6 flex flex-col gap-14 px-4 2xl:px-0">
      <div
        id="footer-header"
        className="flex lg:flex-row flex-col-reverse justify-between gap-8 lg:gap-0"
      >
        {/* mail */}
        <div className="">
          <a
            href="mailto:brainstorm.mushrooms@gmail.com"
            className="flex items-center align-middle gap-2 justify-center lg:justify-start"
          >
            <Button variant="icon" size="sm">
              <MailIcon />
            </Button>
            <p className="font-windsor text-brain-text text-xl ">
              useyourbrain@brainstorm.land
            </p>
          </a>
        </div>
        {/* instagram */}
        <div>
          <a href="https://www.instagram.com/brain___co/" target="#">
            <p className="font-windsor text-brain-text/70 text-xl flex justify-center">
              Instagram
            </p>
          </a>
        </div>
      </div>

      <div
        id="footer-content"
        className="flex flex-col lg:flex-row lg:h-96 space-y-8 lg:space-y-0"
      >
        {/* left side */}
        <div className="flex flex-col lg:border-r-2 border-brain-border/10 lg:w-1/2 lg:pr-8 justify-between">
          <div
            className="flex lg:flex-row flex-col-reverse border-b-2 border-brain-border/10 lg:border-none lg:justify-between text-center lg:text-left gap-4"
            id="left-side-top"
          >
            <div className="lg:w-1/2" id="contact-text">
              <p className="uppercase font-bergenregular text-lg mb-6">
                precisa de ajuda e não encontrou uma solução? mande um email
                para gente. alguém bem sangue bom vai te responder em breve.
              </p>
            </div>
            <div className="lg:pr-8" id="whatsapp-button">
              <a href="https://wa.me/5541992478837" target="#">
                <Button>whatsapp</Button>
              </a>
            </div>
          </div>
          <div id="left-side-bottom">
            <p className="font-windsor text-brain-text hidden lg:block">
              Enjoy your journey.
            </p>
          </div>
        </div>
        {/* right side */}
        <div className="flex flex-col lg:w-1/2 lg:pl-8 justify-between ">
          <div
            id="right-side-top"
            className="flex flex-col lg:flex-row justify-between space-y-8 lg:space-y-0"
          >
            <p className="font-windsor text-brain-text/50 text-sm lg:w-2/3 text-center lg:text-left">
              Na Brain CO. a missão é nutrir a mente, elevar a consciência e
              vestir a expressão de cada alquimista em sua jornada de
              autodescoberta. Com produtos que envolvem boosts para a mente,
              pausas para a rotina, collabs, improvisos, ideias depois de uma
              tempestade e muita trip (coletiva e individual) envolvida,
              queremos te relembrar a importância da conexão com a natureza e
              consigo mesmo. Junte-se a essa comunidade!
            </p>
            <div className="flex justify-center" id="footer-nav-button">
              <a href="#hero">
                <Button variant="arrow" size="md">
                  <ArrowIcon />
                </Button>
              </a>
            </div>
          </div>
          <div
            id="right-side-bottom"
            className="font-windsor flex flex-col lg:flex-row justify-between"
          >
            <p>Brainstorm</p>
            <p>Chuva de ideias</p>
          </div>
        </div>
      </div>
    </div>
  )
}
