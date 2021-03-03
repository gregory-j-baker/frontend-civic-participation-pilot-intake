import React from 'react';
import MainLayout from '../components/layouts/main/MainLayout';

const Custom404 = (): JSX.Element => {
  return (
    <MainLayout showBreadcrumb={false}>
      <div className="mwstext section">
        <div className="row mrgn-tp-lg">
          <div className="col-xs-3 col-sm-2 col-md-1 text-center mrgn-tp-md">
            <span className="glyphicon glyphicon-warning-sign glyphicon-error"></span>
          </div>
          <div className="col-xs-9 col-sm-10 col-md-11">
            <h1 className="mrgn-tp-md">Nous ne pouvons trouver cette page Web</h1>
            <p className="pagetag">
              <b>Erreur 404</b>
            </p>
          </div>
        </div>
        <div className="row mrgn-bttm-lg">
          <div className="col-md-12">
            <p>Nous sommes désolés que vous ayez abouti ici. Il arrive parfois qu’une page ait été déplacée ou supprimée. Heureusement, nous pouvons vous aider à trouver ce que vous cherchez. Que faire?</p>
            <ul>
              <li>
                Retournez à la <a href="/fr.html">page d’accueil</a>;
              </li>
              <li>
                Consultez le <a href="/fr/plan.html">plan du site</a>;
              </li>
              <li>
                <a href="/fr/contact.html">Communiquez avec nous</a> pour obtenir de l’aide.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Custom404;
