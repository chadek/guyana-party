import React, { useState } from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import { LoginEmailWrapper } from './LoginStyles'

function LoginEmail({ email, FacebookBtn, goBack, GoogleBtn, loading, provider, sendEmail }) {
  const [resend, setResend] = useState(false)

  return (
    <LoginEmailWrapper className='grid'>
      {(loading && <CircularProgress />) ||
        (resend && (
          <>
            <h2>Vous n&rsquo;avez pas reçu l&rsquo;e-mail ?</h2>
            <p>Essayez les solutions courantes suivantes :</p>
            <ul>
              <li>Vérifiez que l&rsquo;e-mail n&rsquo;a ni été marqué comme spam ni été filtré.</li>
              <li>Vérifiez votre connexion Internet.</li>
              <li>Vérifiez que votre adresse e-mail est correcte.</li>
              <li>
                Vérifiez que votre boîte de réception n&rsquo;est pas pleine et que les paramètres
                sont correctement définis.
              </li>
            </ul>
            <p>
              Si les étapes décrites plus haut n&rsquo;ont pas résolu le problème, vous pouvez
              renvoyer l&rsquo;e-mail. Sachez que le lien du premier e-mail sera alors désactivé.
            </p>
            <div className='actions grid'>
              <a
                href='#resend-email'
                onClick={() => {
                  setResend(false)
                  sendEmail()
                }}
              >
                Renvoyer
              </a>
              <Button onClick={goBack}>RETOUR</Button>
            </div>
          </>
        )) ||
        (provider && (
          <>
            <h2>Vous avez déjà un compte</h2>
            <p>
              Vous avez déjà utilisé l&rsquo;adresse <strong>{email}</strong>. Connectez-vous avec{' '}
              {provider} pour continuer.
            </p>
            <div className='actions center'>
              {(provider === 'facebook' && <FacebookBtn />) || <GoogleBtn />}
              <Button onClick={goBack}>RETOUR</Button>
            </div>
          </>
        )) || (
          <>
            <h2>E-mail de connexion envoyé</h2>
            <div className='email-sent-icon' />
            <p>
              Un e-mail de connexion avec des instructions supplémentaires a été envoyé à{' '}
              <strong>{email}</strong>. Consultez cet e-mail pour vous connecter.
            </p>
            <div className='actions grid'>
              <a href='#resend-email' onClick={() => setResend(true)}>
                Vous n&rsquo;avez pas reçu l&rsquo;e-mail ?
              </a>
              <Button onClick={goBack}>RETOUR</Button>
            </div>
          </>
        )}
    </LoginEmailWrapper>
  )
}

LoginEmail.propTypes = {
  email: PropTypes.string.isRequired,
  FacebookBtn: PropTypes.func.isRequired,
  GoogleBtn: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  provider: PropTypes.string,
  sendEmail: PropTypes.func.isRequired
}

export default LoginEmail
