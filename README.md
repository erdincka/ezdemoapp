# Ezdemo

You should have python3, pip and Ansible installed and available in your PATH.

```bash
pip3 install ansible
```

Install pyvmomi module if planning to use VMware"

```sh
pip3 install pyvmomi
```

## Run in development setting

install [nodejs](https://nodejs.org/en/download/) & [yarn](https://yarnpkg.com/getting-started/install).

```sh
git clone https://github.com/erdincka/ezdemoapp.git
cd ezdemoapp
yarn dev
```

## Run the app

Download from [release page](https://github.com/erdincka/ezdemoapp/releases).

Start the app EzDemo (wherever it is installed).

## Known issues

[ ] Windows app might fail with fcntl error, as a workaround use linux subsystem if possible
