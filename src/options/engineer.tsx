import css from 'styled-jsx/css'
import Avatar from 'data-base64:~assets/images/avatar/avatar.svg'

export default function Engineer(props) {
  return (
    <section className="engineer">
      <img src={Avatar} alt="" />
      <a className="name" href={props.info.page} target="_blank" rel="noreferrer">
        {props.info.name}
      </a>
      <span className="title">{props.info.title}</span>
      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .engineer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 155px;
    height: 143px;
    margin-right: 16px;
    padding: 16px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 8px 24px rgb(149 157 165 / 20%);

    @media screen and (max-width: 800px) {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }

    img {
      width: 48px;
      height: 48px;
      margin-right: 16px;
    }

    .name {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
    }
  }
`
