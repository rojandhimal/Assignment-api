const { Role } = require('../models');

// TO GET ALL ROLES
module.exports.apiGetAllRoles = async (req, res) => {
  const roles = await Role.find();
  if (roles.length > 0)
    return res.json({ status: true, roles });
  return res.status(404).json({ status: false, msg: 'Roles not found' });
}

// TO GET ROLE BY ROLE-ID
module.exports.apiGetRoleById = async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (role)
    return res.json({ status: true, role });
  return res.status(404).json({ status: false, msg: 'Role not found' });
}

// TO CREATE ROLE
module.exports.apiCreateRole = async (req, res) => {
    const {name}=req.body;
    Role.find({"name":name.toLowerCase()}).then((role)=>{
        if(role.length){
            return res.status(400).json({"status":"failure","message":`Role ${name} already exist`});
        }else{
            Role.create(req.body).then((role)=>{
                return res.json({ status: true, role });
            }).catch((error)=>{
              return res.status(400).json({"status":"failure","message":error?.message});
            })
        }
    }).catch((error)=>{
        return res.status(400).json({"status":"failure","message":error?.message});
      })
}

// TO UPDATE ROLE BY ROLE_ID
module.exports.apiUpdateRoleById = async (req, res) => {
 const role = await Role.findById(req.params.id);
  if (role) {
    role.name = req.body.name;
    await role.save();
    return res.json({ status: true, role });
  }
  return res.status(404).json({ status: false, msg: 'Role not found' });
}

// TO DELETE ROLE BY ROLE_ID
module.exports.apiDeleteRoleById = async (req, res) => {
 Role.findByIdAndRemove(req.params.id).then((role)=>{
     if (role){
         return res.json({ status: true, msg: "Role deleted successfully" });
     }else{
        return res.status(404).json({ status: false, msg: 'Role not found' });
     }
 }).catch((error)=>{
     return res.status(404).json({ status: false, msg: error?.message });
 })
}